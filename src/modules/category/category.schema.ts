import Joi from 'joi';

export const createCategorySchema = {
    body: Joi.object({
        name: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Name is required',
            'string.min':    'Name must be at least 2 characters',
            'string.max':    'Name must be less than 250 characters',
            'any.required':  'Name is required'
        })
    })
};

export const updateCategorySchema = {
    body: Joi.object({
        name: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Name is required',
            'string.min':    'Name must be at least 2 characters',
            'string.max':    'Name must be less than 250 characters',
            'any.required':  'Name is required'
        })
    })
};

export const categoryIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base':     'ID must be a number',
            'number.positive': 'ID must be positive',
            'any.required':    'ID is required'
        })
    })
};