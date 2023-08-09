import * as Joi from 'joi';

export const UserSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(10)
    .required()
    .messages({ 'string.length': 'מספר חייב להיות בן 10 ספרות' }),
}).options({
  abortEarly: false,
});
