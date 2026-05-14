import Joi from 'joi';

export const uploadPhotoSchema = {
    body: Joi.object({
        pro_variant_id: Joi.string().required().messages({
            'string.empty': 'Variant ID is required',
            'any.required': 'Variant ID is required'
        })
    })
};