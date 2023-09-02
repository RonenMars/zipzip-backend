import * as Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Represents a Joi schema for validating user data.
 *
 * @constant {Joi.ObjectSchema}
 * @throws {Joi.ValidationError} If the input data does not conform to the schema.
 * @example
 * import Joi from 'joi';
 * import { UserSchema } from './your-schema-module';
 *
 * const user = {
 *   name: 'John Doe',
 *   email: 'johndoe@example.com',
 *   phone: '1234567890',
 * };
 * const validation = UserSchema.validate(user);
 * if (validation.error) {
 *   console.error(validation.error.message); // Output: "Validation error message"
 * } else {
 *   console.log('User data is valid.');
 * }
 */

export const UserSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.required': 'user.validation.name.required',
    'string.min': 'user.validation.name.min',
    'string.max': 'user.validation.name.max',
  }),
  email: Joi.string().email().messages({
    'string.email': 'user.validation.email.format',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(10)
    .required()
    .custom((value, helper) => {
      if (!isValidPhoneNumber(value, 'IL')) {
        return helper.message('user.validation.phone.isLocalValid' as unknown as Joi.LanguageMessages);
      }

      return true;
    })
    .messages({
      'string.length': 'user.validation.phone.length',
      'string.pattern.base': 'user.validation.phone.pattern',
      'string.required': 'user.validation.phone.required',
    }),
}).options({
  abortEarly: false,
});
