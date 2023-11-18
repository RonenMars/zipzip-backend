import { LimitAttemptsByTime, LimitAttemptsRequestsByRetries } from '@root/validations';

export class UserRequestOTPDto {
  @LimitAttemptsRequestsByRetries()
  @LimitAttemptsByTime()
  phone: string;
}
