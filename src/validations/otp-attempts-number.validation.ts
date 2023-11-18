import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber } from '@root/utils';
import * as moment from 'moment/moment';

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

    if (record && record.loginAttempts && record.loginAttempts > 5) {
      const ifPast = moment().subtract(1, 'minutes').toDate();
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

      throw new HttpException(
        'user.validation.login.tooManyAttempts',
        HttpStatus.TOO_MANY_REQUESTS,
      );
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
