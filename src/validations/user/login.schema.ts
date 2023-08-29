import * as Joi from 'joi';
import { PhoneSchema } from '@validations/user/phone.schema';
import { OTP_LENGTH } from '@utils/constants';

export const LoginSchema = Joi.object({
  phone: PhoneSchema,
  validationCode: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(OTP_LENGTH)
    .required()
    .messages({
      'string.length': 'user.validation.phone.length',
      'string.pattern.base': 'user.validation.phone.pattern',
      'string.required': 'user.validation.phone.required',
    }),
});
