import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JoiValidationPipe } from '@validations/joi-schema.validation';
import { PhoneSchema, UserSchema } from '@validations/user';
import { UserCreateDto } from '@validations/user/dto';
import { generateOTP, getPhoneNumber, hashPassword } from '@root/utils';
import * as moment from 'moment';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/env.variables';
import { sendSMS } from '@utils/twilio';
import { OTP_LENGTH } from '@utils/constants';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(UserSchema))
  async createUser(@Body() user: UserCreateDto) {
    user.codeExpiration = moment().format();
    user.validationCode = generateOTP(4);

    await this.accountService.createUser(user);
  }

  @Get(':phone')
  @UsePipes(new JoiValidationPipe(PhoneSchema))
  async loginUser(@Param('phone') phone: string) {
    const phoneNumber = getPhoneNumber(phone);
    const user = await this.accountService.user(phoneNumber);
    const otpForUser = generateOTP(OTP_LENGTH);
    const message = `Your code is ${otpForUser}`;

    if (user) {
      await this.accountService.updateUser({
        where: { phone: user.phone },
        data: {
          ...user,
          validationCode: await hashPassword(otpForUser),
          codeExpiration: moment().add(3, 'minutes').format(),
        },
      });
      await sendSMS(
        <string>this.configService.get(EnvVariables.TwilioSenderPhoneNumber),
        user.phone,
        message,
        this.twilioService.client,
      );

      return { userId: user.id };
    } else {
      throw new HttpException('No users found', HttpStatus.NO_CONTENT);
    }
  }
}
