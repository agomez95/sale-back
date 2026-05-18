import bcrypt from 'bcrypt';
import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError, ConflictError } from '../../shared/errors/index';
import {
    AdminUserPagedRow,
    AdminUserRow,
    CustomerPagedRow,
    LoginAttemptRow,
    ActiveTokenRow,
    CreateAdminDTO,
} from '../../shared/types/index';
import {
    runPagedQuery,
    revokeAllUserTokens,
    logSuccess,
    PaginationQuery
} from '../../shared/utils/index';

/**
 * Admin Service:
 * El servicio "admin" contiene la lógica de negocio para las operaciones administrativas
 * del sistema, incluyendo la gestión de usuarios admin y clientes, así como la supervisión
 * y gestión de la caché de IPs y los intentos de inicio de sesión.
 */

/**
 * Helper interno:
 * 
 * Activa o desactiva un usuario administrador/cliente según el estado proporcionado, 
 * asegurando que un admin no pueda cambiar su propio estado además de revocar 
 * sus tokens activos si se desactiva.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para cambiar el estado del usuario (definida en QUERIES).
 * @param id - El ID del usuario administrador a activar o desactivar.
 * @param state - El nuevo estado del usuario (true para activar, false para desactivar).
 * @param userType - El tipo de usuario ('admin' o 'customer') para personalizar los mensajes de error y logs.
 * @param requesterId - El ID del usuario que realiza la solicitud, para evitar que un admin cambie su propio estado OPCIONAL.
 * 
 * @throws NotFoundError si el usuario administrador no existe.
 * @throws Error si un admin intenta cambiar su propio estado.
 */
const toggleUserState = async (
    queryKey: string,
    id: string,
    state: boolean,
    userType: 'admin' | 'customer',
    requesterId?: string
): Promise<void> => {
    if (requesterId && id === requesterId) throw new Error('Cannot change your own state'); 

    const users = await db.callFunction<{ id: string }>(
        queryKey,
        { id },
        true
    );

    if (!users.length) {
        throw new NotFoundError(`${userType} user not found`, { id });
    }

    await db.callFunction(queryKey, { id, state });

    if (!state) await revokeAllUserTokens(id, userType);

    logSuccess(`User ${state ? 'activated' : 'deactivated'}`, { id });
};

/**
 * Administradores - Get: Obtiene una lista paginada de usuarios administradores.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de usuarios administradores.
 * @returns Una promesa que resuelve con la lista paginada de usuarios administradores.
 */
export const getAdminUsers = (query: PaginationQuery) =>
    runPagedQuery<AdminUserPagedRow>(QUERIES.ADM_USER.GET_ALL_PAGED, query);
/**
 * Clientes - Get: Obtiene una lista paginada de clientes.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de clientes.
 * @returns Una promesa que resuelve con la lista paginada de clientes.
 */
export const getCustomers = (query: PaginationQuery) =>
    runPagedQuery<CustomerPagedRow>(QUERIES.CST_USER.GET_ALL_PAGED, query);

/**
 * Login Attempts: Obtiene una lista paginada de intentos de inicio de sesión.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de intentos de inicio de sesión.
 * @returns Una promesa que resuelve con la lista paginada de intentos de inicio de sesión.
 */
export const getLoginAttempts = (query: PaginationQuery) =>
    runPagedQuery<LoginAttemptRow>(QUERIES.LOGIN_ATTEMPT.GET_ALL_PAGED, query);

/**
 * Active Tokens: Obtiene una lista paginada de tokens activos.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de tokens activos.
 * @returns Una promesa que resuelve con la lista paginada de tokens activos.
 */
export const getActiveTokens = (query: PaginationQuery) =>
    runPagedQuery<ActiveTokenRow>(QUERIES.TOKEN.GET_ACTIVE_PAGED, query);

/**
 * Administradores - Toggle State: Activa o desactiva un usuario administrador según el estado proporcionado.
 * 
 * @param id - El ID del usuario administrador a activar o desactivar.
 * @param state - El nuevo estado del usuario administrador (true para activar, false para desactivar).
 * @param requesterId - El ID del usuario que realiza la solicitud, para evitar que un admin cambie su propio estado.
 * @returns Una promesa que se resuelve cuando el estado del usuario ha sido cambiado.
 */
export const toggleAdminState = async (id: string, state: boolean, requesterId: string): Promise<void> =>
    toggleUserState(QUERIES.ADM_USER.TOGGLE_STATE, id, state, 'admin', requesterId);

/**
 * Clientes - Toggle State: Activa o desactiva un cliente según el estado proporcionado.
 * 
 * @param id - El ID del cliente a activar o desactivar.
 * @param state - El nuevo estado del cliente (true para activar, false para desactivar).
 * @returns Una promesa que se resuelve cuando el estado del cliente ha sido cambiado.
 */
export const toggleCustomerState = async (id: string, state: boolean): Promise<void> =>
    toggleUserState(QUERIES.CST_USER.TOGGLE_STATE, id, state, 'customer');

/**
 * Revoca todos los tokens activos de un usuario específico, ya sea admin o cliente,
 * lo cual es útil para forzar el cierre de sesión de un usuario en caso de desactivación
 * o compromiso de seguridad.
 * 
 * @param userId - El ID del usuario cuyos tokens se revocarán.
 * @param userType - El tipo de usuario ('admin' o 'customer') para determinar la consulta adecuada.
 * 
 * @returns Una promesa que se resuelve cuando los tokens han sido revocados.
 */
export const revokeUserTokens = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<void> => {
    await revokeAllUserTokens(userId, userType);

    logSuccess('User tokens revoked by admin', { userId });
}

/**
 * Create Admin: Crea un nuevo usuario administrador en el sistema, asegurando que el email
 * no esté ya registrado, hasheando la contraseña antes de almacenarla y registrando el evento
 * en los logs de éxito.
 * 
 * @param data - DTO con la información necesaria para crear un nuevo usuario administrador.
 * @returns - Una promesa que resuelve con el ID del nuevo usuario administrador creado.
 * 
 * @throws ConflictError si el email ya está registrado por otro usuario.
 */
export const createAdmin = async (
    data: CreateAdminDTO
): Promise<{ id: string }> => {
    // Verificar si email ya existe
    const existing = await db.callFunction<AdminUserRow>(
        QUERIES.ADM_USER.GET_BY_EMAIL,
        { email: data.email },
        true
    );

    if (existing.length) {
        throw new ConflictError('Email already registered', { email: data.email });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const result = await db.callFunction<{ fn_add_adm_user: string }>(
        QUERIES.ADM_USER.ADD,
        {
            firstname: data.firstname,
            lastname:  data.lastname,
            email:     data.email,
            password:  hashedPassword,
            role:      data.role
        }
    );

    logSuccess('Admin user created', { email: data.email, role: data.role });
    return { id: result[0].fn_add_adm_user };
};
