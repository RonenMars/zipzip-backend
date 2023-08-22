import * as Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().required(),
  validationCode: Joi.string().required(),
  name: Joi.string().required(),
});
