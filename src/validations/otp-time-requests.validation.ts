import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber } from '@root/utils';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'LimitAttemptsByTime', async: true })
@Injectable()
export class LimitAttemptsByTimeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any): Promise<boolean> {
    if (!value) return false;

    const phoneNumber = getPhoneNumber(value);

    const record = await this.prisma['user'].findUnique({
      where: { phone: phoneNumber },
    });

    const ifPast = moment().subtract(30, 'seconds').toDate();
    if (record && !record.lastSMSCodeRequest) {
      await this.prisma['user'].update({
        where: { phone: phoneNumber },
        data: {
          lastSMSCodeRequest: moment().toDate(),
        },
      });
      return true;
    } else {
      if (record && record.lastSMSCodeRequest) {
        if (new Date(record.lastSMSCodeRequest) > ifPast) {
          throw new HttpException('user.validation.login.tooEarlyAttempt', HttpStatus.BAD_REQUEST);
        }
      }
      return true;
    }
  }
}

export function LimitAttemptsByTime() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: LimitAttemptsByTimeConstraint,
    });
  };
}
