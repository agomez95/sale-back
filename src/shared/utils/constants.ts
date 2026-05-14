export const STATUS_RANGES = new Map([
    ['serverError', { min: 500, max: 599 }],
    ['clientError', { min: 400, max: 499 }],
    ['success',     { min: 200, max: 299 }],
    ['redirect',    { min: 300, max: 399 }]
]);

export const MESSAGES_LOGGER: Record<string, string> = {
    serverError: 'Server error',
    clientError: 'Client error',
    notFound:    'Resource not found',
    success:     'Success',
    redirect:    'Redirect',
    default:     'Request completed'
};

export const TYPE_SCHEMAS = ['body', 'params', 'query'] as const;
export type SchemaSource = typeof TYPE_SCHEMAS[number];