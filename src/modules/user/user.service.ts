import bcrypt from 'bcrypt';
import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { UnauthorizedError, ConflictError } from '../../shared/errors/index';
import { generateTokenPair, revokeAllUserTokens, rotateRefreshToken } from '../../shared/utils/index';
import { logSuccess } from '../../shared/utils/index';
import { 
    AdminUserRow, 
    CustomerRow, 
    TokenPayload, 
    AuthTokens,
    SignupCustomerDTO,
    SigninDTO
} from '../../shared/types/index';

/***
 * User Service:
 * 
 * El servicio "user" contiene la lógica de negocio para las operaciones relacionadas con los usuarios del sistema, 
 * incluyendo el registro de nuevos clientes, el inicio de sesión para administradores y clientes, la actualización de tokens de acceso 
 * utilizando refresh tokens, el cierre de sesión y la recuperación de la información del usuario autenticado.
 * 
 * Este servicio se encarga de ejecutar las consultas necesarias para obtener la información requerida y construir las respuestas 
 * adecuadas para cada caso de uso, así como manejar los errores correspondientes en caso de que las operaciones no puedan ser 
 * completadas exitosamente.
 * 
 * Las funciones dentro de este servicio interactúan con la base de datos a través del módulo de conexión y utilizan utilidades 
 * para el manejo de tokens y el registro de eventos importantes como inicios de sesión exitosos o fallidos.
 * 
 * Además, se asegura de que las contraseñas sean manejadas de manera segura utilizando hashing, y que los tokens sean generados y 
 * revocados adecuadamente para mantener la seguridad del sistema.
 * 
 * En resumen, el servicio "user" es fundamental para la gestión de la autenticación y autorización en el sistema,
 */

/**
 * 
 * @description - Esta función extrae la dirección IP y el agente de usuario de la solicitud HTTP para su uso en operaciones 
 * como el inicio de sesión, donde esta información puede ser útil para auditoría y seguridad.
 * La función maneja casos donde la dirección IP puede estar presente en los headers (por ejemplo, a través de un proxy) 
 * o en el socket de la conexión.
 * 
 * @param req - El objeto de solicitud HTTP, que contiene información sobre los headers y el socket de la conexión.
 * @param req.headers - Headers de la solicitud HTTP, que pueden incluir información como el agente de usuario (user-agent) y la dirección IP del cliente.
 * @param req.socket - El socket de la conexión, que puede proporcionar información adicional sobre la conexión del cliente, como la dirección IP remota.
 * @returns - Un objeto que contiene la dirección IP y el agente de usuario del cliente.
 */
export const getClientInfo = (req: {
    headers: { [key: string]: string | string[] | undefined };
    socket: { remoteAddress?: string };
}) => {
    const ip = (
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress || '0.0.0.0'
    ).split(',')[0].trim();

    const userAgent = req.headers['user-agent'] as string || 'unknown';
    return { ip, userAgent };
};

/**
 * @description - Esta función maneja el proceso de registro de un nuevo cliente en el sistema.
 * El proceso incluye la verificación de que el email proporcionado no esté ya registrado, el hash de la contraseña para seguridad,
 * y la inserción de un nuevo registro en la base de datos para el cliente. Si el email ya existe, se lanza un error de conflicto.
 * 
 * @param data - DTO que contiene la información necesaria para registrar un nuevo cliente, incluyendo nombre, apellido, email y contraseña.
 * @returns - Un objeto que contiene el ID del nuevo cliente registrado en el sistema.
 * 
 * @throws - ConflictError si el email proporcionado ya está registrado en el sistema.
 */
export const signupCustomer = async (
    data: SignupCustomerDTO
): Promise<{ id: string }> => {
    // Verificar si el email ya existe
    const existing = await db.callFunction<CustomerRow>(
        QUERIES.CST_USER.GET_BY_EMAIL,
        { email: data.email },
        true
    );

    if (existing.length) {
        throw new ConflictError('Email already registered', { email: data.email });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Crear customer
    const result = await db.callFunction<{ fn_add_cst_user: string }>(
        QUERIES.CST_USER.ADD,
        {
            firstname: data.firstname,
            lastname:  data.lastname,
            email:     data.email,
            password:  hashedPassword
        }
    );

    logSuccess('Customer registered', { email: data.email });
    return { id: result[0].fn_add_cst_user };
};

/**
 * @description - Esta función maneja el proceso de inicio de sesión para usuarios administradores y clientes. 
 * El proceso incluye la verificación de las credenciales proporcionadas (email y contraseña), la generación 
 * de tokens de autenticación (access token y refresh token) si las credenciales son válidas, y el registro de los 
 * intentos de inicio de sesión para auditoría. Si las credenciales son inválidas o la cuenta está deshabilitada, 
 * se lanza un error de no autorizado.
 * 
 * @param data - DTO que contiene la información necesaria para iniciar sesión, incluyendo email, contraseña y tipo de usuario (admin o customer).
 * @param ip - La dirección IP del cliente que intenta iniciar sesión, utilizada para auditoría y seguridad.
 * @param userAgent - El agente de usuario del cliente que intenta iniciar sesión, utilizado para auditoría y seguridad.
 * @returns - Un objeto que contiene los tokens de autenticación generados y la información del usuario que ha iniciado sesión (sin la contraseña).
 * 
 * @throws - UnauthorizedError si las credenciales son inválidas o la cuenta está deshabilitada.
 */
export const signin = async (
    data: SigninDTO,
    ip: string,
    userAgent: string
): Promise<{ tokens: AuthTokens; user: Partial<AdminUserRow | CustomerRow> }> => {
    const { email, password, type } = data;

    // Registrar intento (siempre, para auditoría)
    const logAttempt = async (success: boolean) => {
        await db.callFunction(QUERIES.LOGIN_ATTEMPT.ADD, {
            email,
            user_type: type,
            ip,
            success
        });
    };

    if (type === 'admin') {
        // Buscar admin
        const admins = await db.callFunction<AdminUserRow>(
            QUERIES.ADM_USER.GET_BY_EMAIL,
            { email },
            true
        );

        if (!admins.length) {
            await logAttempt(false);
            throw new UnauthorizedError('Invalid credentials');
        }

        const admin = admins[0];

        if (!admin.state) {
            await logAttempt(false);
            throw new UnauthorizedError('Account disabled');
        }

        // Verificar password
        const match = await bcrypt.compare(password, admin.password);
        await logAttempt(match);

        if (!match) throw new UnauthorizedError('Invalid credentials');

        // Generar tokens
        const payload: TokenPayload = {
            userId: admin.id,
            email:  admin.email,
            role:   admin.role,
            type:   'admin'
        };

        const tokens = await generateTokenPair(payload, ip, userAgent);

        logSuccess('Admin signed in', { email });
        return {
            tokens,
            user: {
                id:        admin.id,
                firstname: admin.firstname,
                lastname:  admin.lastname,
                email:     admin.email,
                role:      admin.role
            }
        };

    } else {
        // Buscar customer
        const customers = await db.callFunction<CustomerRow>(
            QUERIES.CST_USER.GET_BY_EMAIL,
            { email },
            true
        );

        if (!customers.length) {
            await logAttempt(false);
            throw new UnauthorizedError('Invalid credentials');
        }

        const customer = customers[0];

        if (!customer.state) {
            await logAttempt(false);
            throw new UnauthorizedError('Account disabled');
        }

        // Verificar password
        const match = await bcrypt.compare(password, customer.password);
        await logAttempt(match);

        if (!match) throw new UnauthorizedError('Invalid credentials');

        // Generar tokens
        const payload: TokenPayload = {
            userId: customer.id,
            email:  customer.email,
            role:   'customer',
            type:   'customer'
        };

        const tokens = await generateTokenPair(payload, ip, userAgent);

        logSuccess('Customer signed in', { email });
        return {
            tokens,
            user: {
                id:        customer.id,
                firstname: customer.firstname,
                lastname:  customer.lastname,
                email:     customer.email
            }
        };
    }
};

/**
 * @description - Esta función maneja el proceso de actualización del token de acceso utilizando un token de actualización (refresh token). 
 * El proceso incluye la verificación de la validez del token de actualización proporcionado, la generación de un nuevo token 
 * de acceso si el token de actualización es válido, y la revocación del token de actualización antiguo para evitar su reutilización. 
 * Si el token de actualización es inválido o ha expirado, se lanza un error de no autorizado.
 * 
 * @param rawToken - El token de actualización proporcionado por el cliente, que se utilizará para generar un nuevo token de acceso.
 * @param ip - La dirección IP del cliente que solicita la actualización del token, utilizada para auditoría y seguridad.
 * @param userAgent - El agente de usuario del cliente que solicita la actualización del token, utilizado para auditoría y seguridad.
 * @returns - Un objeto que contiene el nuevo token de acceso generado.
 * 
 * @throws - UnauthorizedError si el token de actualización es inválido o ha expirado.
 */
export const refreshToken = async (
    rawToken: string,
    ip: string,
    userAgent: string
): Promise<{ accessToken: string }> => {
    const result = await rotateRefreshToken(rawToken, ip, userAgent);

    if (!result) {
        throw new UnauthorizedError('Invalid or expired refresh token', {
            code: 'REFRESH_INVALID'
        });
    }

    return { accessToken: result.tokens.accessToken };
};

/**
 * @description - Esta función maneja el proceso de cierre de sesión para un usuario, lo que implica la revocación de todos 
 * los tokens de autenticación asociados al usuario para garantizar que no puedan ser utilizados después del cierre de sesión. 
 * Esto es especialmente importante para mantener la seguridad, ya que asegura que cualquier token comprometido o en posesión de 
 * terceros deje de ser válido inmediatamente después del cierre de sesión. La función toma el ID del usuario y su tipo (admin o customer) 
 * para identificar correctamente los tokens a revocar.
 * 
 * @param userId - El ID del usuario que está cerrando sesión, utilizado para identificar los tokens de autenticación asociados a ese usuario.
 * @param userType - El tipo de usuario (admin o customer) que está cerrando sesión, utilizado para identificar correctamente los tokens a revocar.
 * @returns - Una promesa que se resuelve cuando todos los tokens de autenticación del usuario han sido revocados.
 */
export const logout = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<void> => {
    await revokeAllUserTokens(userId, userType);
    logSuccess('User logged out', { userId });
};

/**
 * @description - Esta función maneja la recuperación de la información del usuario actualmente autenticado, utilizando su ID y 
 * tipo de usuario para consultar la base de datos.
 * La función devuelve la información del usuario sin incluir la contraseña, y lanza un error de no autorizado si el usuario no se 
 * encuentra o si la cuenta está deshabilitada.
 * 
 * @param userId - El ID del usuario que está recuperando su información, utilizado para consultar la base de datos.
 * @param userType - El tipo de usuario (admin o customer) que está recuperando su información, utilizado para identificar correctamente la consulta.
 * @returns - Un objeto que contiene la información del usuario sin la contraseña.
 * 
 * @throws - UnauthorizedError si el usuario no se encuentra o si la cuenta está deshabilitada.
 */
export const getMe = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<Partial<AdminUserRow | CustomerRow>> => {
    if (userType === 'admin') {
        const result = await db.callFunction<AdminUserRow>(
            QUERIES.ADM_USER.GET_BY_ID,
            { id: userId },
            true
        );

        if (!result.length) {
            throw new UnauthorizedError('User not found');
        }

        const { password, ...user } = result[0];
        return user;
    } else {
        const result = await db.callFunction<CustomerRow>(
            QUERIES.CST_USER.GET_BY_ID,
            { id: userId },
            true
        );

        if (!result.length) {
            throw new UnauthorizedError('User not found');
        }

        const { password, ...user } = result[0];
        return user;
    }
};
