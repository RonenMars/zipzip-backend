import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber } from '@root/utils';
import * as moment from 'moment/moment';
import { OTP_MAX_ATTEMPTS, OTP_TIME_UNTIL_THE_NEXT_ATTEMPT } from '@utils/constants';
import { translate } from '@i18n/translate';

@ValidatorConstraint({ name: 'LimitAttemptsRequestsByRetries', async: true })
@Injectable()
export class LimitAttemptsRequestsByRetriesConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any): Promise<boolean> {
    if (!value) return false;

    const phoneNumber = getPhoneNumber(value);

    const record = await this.prisma['user'].findUnique({
      where: { phone: phoneNumber },
    });

    if (record && record.loginAttempts && record.loginAttempts > OTP_MAX_ATTEMPTS) {
      const ifPast = moment().subtract(OTP_TIME_UNTIL_THE_NEXT_ATTEMPT, 'minutes').toDate();
      if (record && record.lastSMSCodeRequest) {
        if (new Date(record.lastSMSCodeRequest) < ifPast) {
          await this.prisma['user'].update({
            where: { phone: phoneNumber },
            data: {
              loginAttempts: 0,
            },
          });
          return true;
        }
      }

      const errorMessage = translate('user.validation.login.tooManyAttempts').replace(
        '{minutes}',
        OTP_TIME_UNTIL_THE_NEXT_ATTEMPT.toString(),
      );

      throw new HttpException(errorMessage, HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.prisma['user'].update({
      where: { phone: phoneNumber },
      data: {
        loginAttempts: record ? record.loginAttempts + 1 : 1,
      },
    });

    return true;
  }
}

export function LimitAttemptsRequestsByRetries() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: LimitAttemptsRequestsByRetriesConstraint,
    });
  };
}
