export class HttpError extends Error {
    public statusCode: number;
    public details: Record<string, unknown>;

    constructor(
        statusCode: number,
        message: string,
        details: Record<string, unknown> = {}
    ) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', details: Record<string, unknown> = {}) {
        super(400, message, details);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', details: Record<string, unknown> = {}) {
        super(401, message, details);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', details: Record<string, unknown> = {}) {
        super(403, message, details);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Not Found', details: Record<string, unknown> = {}) {
        super(404, message, details);
        this.name = 'NotFoundError';
    }
}

// Extra: útiles para tu proyecto
export class ConflictError extends HttpError {
    constructor(message = 'Conflict', details: Record<string, unknown> = {}) {
        super(409, message, details);
        this.name = 'ConflictError';
    }
}

export class UnprocessableError extends HttpError {
    constructor(message = 'Unprocessable Entity', details: Record<string, unknown> = {}) {
        super(422, message, details);
        this.name = 'UnprocessableError';
    }
}