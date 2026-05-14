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
    parsePagination,
    getOffset,
    buildPaginatedResponse,
    PaginatedResponse,
    revokeAllUserTokens,
    logSuccess
} from '../../shared/utils/index';

/**
 * Admin Service:
 * El servicio "admin" contiene la lógica de negocio para las operaciones administrativas
 * del sistema, incluyendo la gestión de usuarios admin y clientes, así como la supervisión
 * y gestión de la caché de IPs y los intentos de inicio de sesión.
 */

// ─── Helper interno ─────────────────────────────────────────
/**
 * La ejecución de una consulta paginada genérica desde la base de datos
 * centralizando así, la lógica de paginación en las distintas operaciones de este servicio
 * usando el parsing, offset ademas de la extración del total y la construcción de la respuesta.
 * 
 * @param queryKey - La clave de la consulta a ejecutar (definida en QUERIES).
 * @param query - Parámetros de consulta para paginación opcionales.
 * @param query.page - Número de página (opcional, por defecto 1).
 * @param query.limit - Cantidad de registros por página (opcional, por defecto 10).
 * @param extraParams - Parámetros adicionales a pasar a la consulta (opcional).
 * 
 * @returns - Una promesa que resuelve en una respuesta paginada, con los datos de los
 * solicitadso (sin el campo total) y la metadata de paginación.
 */
export const runPagedQuery = async <T extends { total: number }>(
    queryKey: string,
    query: { page?: string; limit?: string },
    extraParams?: Record<string, unknown>
): Promise<PaginatedResponse<Omit<T, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<T>(
        queryKey,
        { limit, offset, ...extraParams },
        true
    );
    
    const total = rows.length > 0 ? Number((rows[0] as any).total) : 0;
    const data = rows.map(({ total, ...row }) => row as Omit<T, 'total'>);

    return buildPaginatedResponse(data, total, page, limit);
}

// Administradores - Get: Obtiene una lista paginada de usuarios administradores.
export const getAdminUsers = (query: { page?: string; limit?: string }) =>
    runPagedQuery<AdminUserPagedRow>(QUERIES.ADM_USER.GET_ALL_PAGED, query);

/**
 * Activa o desactiva un usuario administrador según el estado proporcionado, 
 * asegurando que un admin no pueda cambiar su propio estado además de revocar 
 * sus tokens activos si se desactiva.
 * 
 * @param id - El ID del usuario administrador a activar o desactivar.
 * @param state - El nuevo estado del usuario (true para activar, false para desactivar).
 * @param requesterId - El ID del usuario que realiza la solicitud, para evitar que un admin cambie su propio estado.
 * 
 * @throws NotFoundError si el usuario administrador no existe.
 * @throws Error si un admin intenta cambiar su propio estado.
 */
export const toggleAdminState = async (
    id: string,
    state: boolean,
    requesterId: string
): Promise<void> => {
    // Evita que un admin cambie su propio estado
    if(id === requesterId) {
        throw new Error('Cannot change your own state');
    }

    const users = await db.callFunction<AdminUserRow>(
        QUERIES.ADM_USER.GET_BY_ID,
        { id },
        true
    );

    if (!users.length) {
        throw new NotFoundError('Admin user not found', { id });
    }

    await db.callFunction(QUERIES.ADM_USER.TOGGLE_STATE, { id, state });

    // Si el admin se desactiva, revoca todos sus tokens activos
    if (!state) {
        await revokeAllUserTokens(id, 'admin');
    }
    
    logSuccess(`Admin user ${state ? 'activated' : 'deactivated'}`, { id });
};


// Clientes - Get: Obtiene una lista paginada de clientes.
export const getCustomers = (query: { page?: string; limit?: string }) =>
    runPagedQuery<CustomerPagedRow>(QUERIES.CST_USER.GET_ALL_PAGED, query);

/**
 * Activa o desactiva un usuario cliente según el estado proporcionado, 
 * asegurando que un cliente no pueda cambiar su propio estado además de revocar 
 * sus tokens activos si se desactiva.
 * 
 * @param id - El ID del usuario cliente a activar o desactivar.
 * @param state - El nuevo estado del usuario (true para activar, false para desactivar).
 * 
 * @throws NotFoundError si el usuario cliente no existe.
 * @throws Error si un cliente intenta cambiar su propio estado.
 */
export const toggleCustomerState = async (
    id: string, 
    state: boolean
): Promise<void> => {
    const users = await db.callFunction<AdminUserRow>(
        QUERIES.CST_USER.GET_BY_ID,
        { id },
        true
    );

    if (!users.length) {
        throw new NotFoundError('Customer user not found', { id });
    }

    await db.callFunction(QUERIES.CST_USER.TOGGLE_STATE, { id, state });

    // Si el cliente se desactiva, revoca todos sus tokens activos
    if (!state) {
        await revokeAllUserTokens(id, 'customer');
    }
    
    logSuccess(`Customer ${state ? 'activated' : 'deactivated'}`, { id });
}

// Login Attempts: Obtiene una lista paginada de intentos de inicio de sesión.
export const getLoginAttempts = (query: { page?: string; limit?: string }) =>
    runPagedQuery<LoginAttemptRow>(QUERIES.LOGIN_ATTEMPT.GET_ALL_PAGED, query);

// Active Tokens: Obtiene una lista paginada de tokens activos.
export const getActiveTokens = (query: { page?: string; limit?: string }) =>
    runPagedQuery<ActiveTokenRow>(QUERIES.TOKEN.GET_ACTIVE_PAGED, query);

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
 * @param data - DTO con los datos necesarios para crear un nuevo usuario administrador.
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
