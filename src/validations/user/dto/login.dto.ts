import { LimitAttemptsRequestsByRetries } from '@root/validations';

export class UserLoginDto {
  @LimitAttemptsRequestsByRetries()
  phone: string;
  validationCode: string;
}
