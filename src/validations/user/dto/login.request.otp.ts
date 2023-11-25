import { LimitAttemptsByTime } from '@root/validations';

export class UserRequestOTPDto {
  @LimitAttemptsByTime()
  phone: string;
}
