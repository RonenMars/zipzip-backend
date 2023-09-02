import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes } from '@nestjs/common';
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

  /**
   * Create a new user.
   * @param {UserCreateDto} user - The user object to be created.
   * @returns {Promise<void>}
   */
  @Post()
  @UsePipes(new JoiValidationPipe(UserSchema))
  async createUser(@Body() user: UserCreateDto) {
    user.codeExpiration = moment().format();
    user.validationCode = generateOTP(4);

    await this.accountService.createUser(user);
  }

  /**
   * Login a user using their phone number.
   * @param {string} phone - The user's phone number.
   * @returns {Promise<{ userId: number } | HttpException>}
   */
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
      if (process.env.NODE_ENV === 'production') {
        await sendSMS(
          <string>this.configService.get(EnvVariables.TwilioSenderPhoneNumber),
          user.phone,
          message,
          this.twilioService.client,
        );
      } else {
        console.log('OTP Code: ', otpForUser);
      }

      return;
    } else {
      throw new HttpException('user.validation.login.noUsersFound', HttpStatus.BAD_REQUEST);
    }
  }
}
