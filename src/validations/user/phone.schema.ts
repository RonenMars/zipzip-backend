import * as Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Represents a Joi schema for validating phone numbers.
 *
 * @constant {Joi.StringSchema}
 * @throws {Joi.ValidationError} If the input does not conform to the schema.
 * @example
 * import Joi from 'joi';
 * import { PhoneSchema } from './your-schema-module';
 *
 * const phoneNumber = '1234567890';
 * const validation = PhoneSchema.validate(phoneNumber);
 * if (validation.error) {
 *   console.error(validation.error.message); // Output: "Validation error message"
 * } else {
 *   console.log('Phone number is valid.');
 * }
 */
export const PhoneSchema = Joi.string()
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
  });
