import * as Joi from 'joi';

export const PhoneSchema = Joi.number().length(4).required().messages({
  'number.length': 'user.validation.code.length',
  'number.required': 'user.validation.code.required',
});
