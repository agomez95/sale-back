import { Request, Response, NextFunction } from 'express';
import { Schema, ObjectSchema } from 'joi';
import { HttpError } from '../errors/http-error';
import { TYPE_SCHEMAS, SchemaSource } from '../utils/constants';

interface ValidationIssue {
    path: string;
    message: string;
}

type RequestSchema = Partial<Record<SchemaSource, ObjectSchema>>;

const validateSchema = (schema: Schema, data: unknown, source: string): unknown => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
    });

    if (error) {
        const issues: ValidationIssue[] = error.details.map(detail => ({
            path:    `${source}.${detail.path.join('.')}`,
            message: detail.message
        }));

        throw new HttpError(422, 'Validation Error', { issues });
    }

    return value;
};

export const validateRequest = (schema: RequestSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            TYPE_SCHEMAS.forEach((source: SchemaSource) => {
                if (schema[source]) {
                    validateSchema(schema[source]!, req[source], source);
                }
            });

            next();
        } catch (error) {
            next(error);
        }
    };
};