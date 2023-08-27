import * as Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const PhoneSchema = Joi.string()
  .pattern(/^[0-9]+$/)
  .length(10)
  .required()
  .custom((value, helper) => {
    if (!isValidPhoneNumber(value, 'IL')) {
      return helper.message(
        'user.validation.phone.isLocalValid' as unknown as Joi.LanguageMessages,
      );
    }

    return true;
  })
  .messages({
    'string.length': 'user.validation.phone.length',
    'string.pattern.base': 'user.validation.phone.pattern',
    'string.required': 'user.validation.phone.required',
  });
