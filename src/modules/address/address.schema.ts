import Joi from 'joi';

const addressBody = {
    number: Joi.string().required().max(250).messages({
        'string.empty':  'Number is required',
        'any.required':  'Number is required'
    }),
    street: Joi.string().required().max(250).messages({
        'string.empty':  'Street is required',
        'any.required':  'Street is required'
    }),
    address_line_1: Joi.string().optional().max(250).allow('', null),
    address_line_2: Joi.string().optional().max(250).allow('', null),
    city: Joi.string().required().max(250).messages({
        'string.empty':  'City is required',
        'any.required':  'City is required'
    }),
    state_province: Joi.string().required().max(250).messages({
        'string.empty':  'State/Province is required',
        'any.required':  'State/Province is required'
    }),
    postal_code: Joi.string().required().max(250).messages({
        'string.empty':  'Postal code is required',
        'any.required':  'Postal code is required'
    }),
    country_id: Joi.number().integer().positive().required().messages({
        'number.base':     'Country ID must be a number',
        'number.positive': 'Country ID must be positive',
        'any.required':    'Country ID is required'
    })
};

export const createAddressSchema = {
    body: Joi.object(addressBody)
};

export const updateAddressSchema = {
    body: Joi.object(addressBody)
};

export const addressIdSchema = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base':     'ID must be a number',
            'number.positive': 'ID must be positive',
            'any.required':    'ID is required'
        })
    })
};