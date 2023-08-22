import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JoiValidationPipe } from '@validations/joi-schema.validation';
import { PhoneSchema, UserSchema } from '@validations/user';
import { UserCreateDto } from '@validations/user/dto';
import { getPhoneNumber, getRandomCode, isValidPhoneNumber } from '@root/utils';
import * as moment from 'moment';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/env.variables';
import { sendSMS } from '@utils/twilio';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly twilioService: TwilioService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(UserSchema))
  createUser(@Body() user: UserCreateDto) {
    if (isValidPhoneNumber(user.phone)) {
      user.codeExpiration = moment().format();
      user.validationCode = getRandomCode();

      this.accountService.createUser(user);
    }
  }

  @Get(':phone')
  @UsePipes(new JoiValidationPipe(PhoneSchema))
  async loginUser(@Param('phone') phone: string) {
    if (isValidPhoneNumber(phone)) {
      const phoneNumber = getPhoneNumber(phone);
      const user = await this.accountService.user(phoneNumber);
      if (user) {
        await sendSMS(
          this.configService.get(EnvVariables.TwilioSenderPhoneNumber) || '',
          user.phone,
          'SMS Body, sent to the phone!',
          this.twilioService.client,
        );

        return user.id;
      } else {
        throw new HttpException('No users found', HttpStatus.NO_CONTENT);
      }
    }
    throw new HttpException('Bad phone number', HttpStatus.BAD_REQUEST);
  }
}
