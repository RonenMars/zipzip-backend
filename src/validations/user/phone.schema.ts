import * as Joi from 'joi';

export const PhoneSchema = Joi.string()
  .pattern(/^[0-9]+$/)
  .length(10)
  .required()
  .messages({
    'string.length': 'user.validation.phone.length',
    'string.pattern.base': 'user.validation.phone.pattern',
    'string.required': 'user.validation.phone.required',
  });
