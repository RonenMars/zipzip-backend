import { PhoneSchema } from '@validations/user/phone.schema';
import * as Joi from 'joi';

export const OtpResendRequestSchema = Joi.object({
  phone: PhoneSchema,
});
