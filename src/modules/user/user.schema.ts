import Joi from 'joi';

export const signupCustomerSchema = {
    body: Joi.object({
        firstname: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Firstname is required',
            'any.required':  'Firstname is required'
        }),
        lastname: Joi.string().required().min(2).max(250).messages({
            'string.empty':  'Lastname is required',
            'any.required':  'Lastname is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email':  'Invalid email format',
            'any.required':  'Email is required'
        }),
        password: Joi.string().required().min(8).max(100)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .messages({
                'string.min':     'Password must be at least 8 characters',
                'string.pattern.base': 'Password must have uppercase, lowercase and number',
                'any.required':   'Password is required'
            })
    })
};

export const createAdminSchema = {
    body: Joi.object({
        firstname: Joi.string().required().min(2).max(250),
        lastname:  Joi.string().required().min(2).max(250),
        email:     Joi.string().email().required(),
        password:  Joi.string().required().min(8).max(100)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        role: Joi.string().valid('admin', 'editor').required().messages({
            'any.only':     'Role must be admin or editor',
            'any.required': 'Role is required'
        })
    })
};

export const signinSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email':  'Invalid email format',
            'any.required':  'Email is required'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required'
        }),
        type: Joi.string().valid('admin', 'customer').required().messages({
            'any.only':     'Type must be admin or customer',
            'any.required': 'Type is required'
        })
    })
};