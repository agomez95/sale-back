import Joi from 'joi';

export const createSpecSchema = {
    body: Joi.object({
        specification_constant_id: Joi.number().integer().valid(1, 2, 3).required().messages({
            'number.base':   'Specification constant ID must be a number',
            'any.only':      'Specification constant ID must be 1 (COLOR), 2 (SIZE) or 3 (TEXT)',
            'any.required':  'Specification constant ID is required'
        }),
        subcategory_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Subcategory ID must be a number',
            'number.positive': 'Subcategory ID must be positive',
            'any.required':    'Subcategory ID is required'
        })
    })
};

export const createSpecValueSchema = {
    body: Joi.object({
        value: Joi.string().required().min(1).max(250).messages({
            'string.empty':  'Value is required',
            'string.min':    'Value must be at least 1 character',
            'string.max':    'Value must be less than 250 characters',
            'any.required':  'Value is required'
        }),
        specification_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Specification ID must be a number',
            'number.positive': 'Specification ID must be positive',
            'any.required':    'Specification ID is required'
        })
    })
};

export const specIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base':     'ID must be a number',
            'number.positive': 'ID must be positive',
            'any.required':    'ID is required'
        })
    })
};