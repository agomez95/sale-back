import Joi from 'joi';

export const createProductSchema = {
    body: Joi.object({
        name: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Name is required',
            'string.min':    'Name must be at least 2 characters',
            'string.max':    'Name must be less than 250 characters',
            'any.required':  'Name is required'
        }),
        description: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Description is required',
            'string.min':    'Description must be at least 2 characters',
            'string.max':    'Description must be less than 250 characters',
            'any.required':  'Description is required'
        }),
        long_description: Joi.string().required().min(2).messages({
            'string.empty':  'Long description is required',
            'string.min':    'Long description must be at least 2 characters',
            'any.required':  'Long description is required'
        }),
        subcategory_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Subcategory ID must be a number',
            'number.positive': 'Subcategory ID must be positive',
            'any.required':    'Subcategory ID is required'
        }),
        brand_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Brand ID must be a number',
            'number.positive': 'Brand ID must be positive',
            'any.required':    'Brand ID is required'
        })
    })
};

export const productIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base':     'ID must be a number',
            'number.positive': 'ID must be positive',
            'any.required':    'ID is required'
        })
    })
};