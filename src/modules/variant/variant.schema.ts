import Joi from 'joi';

export const createVariantSchema = {
    body: Joi.object({
        name: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Name is required',
            'string.min':    'Name must be at least 2 characters',
            'string.max':    'Name must be less than 250 characters',
            'any.required':  'Name is required'
        }),
        stock: Joi.number().integer().min(0).required().messages({
            'number.base':    'Stock must be a number',
            'number.min':     'Stock must be 0 or greater',
            'any.required':   'Stock is required'
        }),
        cost: Joi.number().positive().required().messages({
            'number.base':     'Cost must be a number',
            'number.positive': 'Cost must be greater than 0',
            'any.required':    'Cost is required'
        }),
        product_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Product ID must be a number',
            'number.positive': 'Product ID must be positive',
            'any.required':    'Product ID is required'
        })
    })
};

export const createVariantSpecValSchema = {
    body: Joi.object({
        variant_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Variant ID must be a number',
            'number.positive': 'Variant ID must be positive',
            'any.required':    'Variant ID is required'
        }),
        specification_value_id: Joi.number().integer().positive().required().messages({
            'number.base':     'Specification value ID must be a number',
            'number.positive': 'Specification value ID must be positive',
            'any.required':    'Specification value ID is required'
        })
    })
};

export const variantIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base':     'ID must be a number',
            'number.positive': 'ID must be positive',
            'any.required':    'ID is required'
        })
    })
};