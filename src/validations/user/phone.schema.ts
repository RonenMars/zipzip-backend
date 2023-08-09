import * as Joi from 'joi';

export const PhoneSchema = Joi.string()
  .pattern(/^[0-9]+$/)
  .length(10)
  .required()
  .messages({ 'string.length': 'מספר חייב להיות בן 10 ספרות' });
