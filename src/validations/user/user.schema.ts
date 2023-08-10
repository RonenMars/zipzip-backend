import * as Joi from 'joi';
import { I18nContext } from 'nestjs-i18n';
const i18n = I18nContext.current();

export const UserSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(10)
    .required()
    .messages({ 'string.length': i18n?.t('user.phoneLengthError') || '' }),
}).options({
  abortEarly: false,
});
