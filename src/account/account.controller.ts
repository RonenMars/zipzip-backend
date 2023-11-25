import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JoiValidationPipe } from '@root/validations';
import { LoginSchema, PhoneSchema, UserSchema } from '@validations/user';
import { UserLoginDto } from '@validations/user/dto';
import { generateOTP, getPhoneNumber, hashPassword } from '@root/utils';
import * as moment from 'moment';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/env.variables';
import { sendSMS } from '@utils/twilio';
import { OTP_FLOW_EXPIRATION_MINUTES, OTP_LENGTH } from '@utils/constants';
import { UserRegisterDto } from '@validations/user/dto/register.dto';
import { AuthService } from '@root/auth';
import { UserRequestOTPDto } from '@validations/user/dto/login.request.otp';
import { OtpResendRequestSchema } from '@validations/user/otpResendRequest';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new user.
   * @param {UserRegisterDto} newUser - The user object to be created.
   */
  @Post('register')
  @UsePipes(new JoiValidationPipe(UserSchema))
  async createUser(@Body() newUser: UserRegisterDto) {
    const phoneNumber = getPhoneNumber(newUser.phone);

    const user = await this.accountService.user({ phone: phoneNumber, email: newUser.email });

    const otpForUser = generateOTP(OTP_LENGTH);
    const message = `Your code is ${otpForUser}`;

    if (!user) {
      await this.accountService.createUser({
        email: newUser.email,
        isVerified: false,
        name: newUser.name,
        phone: phoneNumber,
        validationCode: await hashPassword(otpForUser),
        codeExpiration: moment().add(OTP_FLOW_EXPIRATION_MINUTES, 'minutes').format(),
      });

      if (process.env.NODE_ENV === 'production') {
        await sendSMS(
          <string>this.configService.get(EnvVariables.TwilioSenderPhoneNumber),
          phoneNumber,
          message,
          this.twilioService.client,
        );
      } else {
        console.log('OTP Code: ', otpForUser);
      }

      return;
    }

    throw new HttpException('user.validation.register.userExist', HttpStatus.BAD_REQUEST);
  }

  @Post('otp/resend')
  @UsePipes(new JoiValidationPipe(OtpResendRequestSchema))
  async resendOtpCode(@Body() userOTPRequest: UserRequestOTPDto) {
    const phoneNumber = getPhoneNumber(userOTPRequest.phone);

    const user = await this.accountService.user({
      phone: phoneNumber,
    });

    const otpForUser = generateOTP(OTP_LENGTH);
    const message = `Your code is ${otpForUser}`;

    if (user) {
      await this.accountService.updateUser({
        where: { phone: user.phone },
        data: {
          ...user,
          validationCode: await hashPassword(otpForUser),
          codeExpiration: moment().add(OTP_FLOW_EXPIRATION_MINUTES, 'minutes').format(),
          lastSMSCodeRequest: moment().toDate(),
        },
      });

      if (process.env.NODE_ENV === 'production') {
        await sendSMS(
          <string>this.configService.get(EnvVariables.TwilioSenderPhoneNumber),
          phoneNumber,
          message,
          this.twilioService.client,
        );
      } else {
        console.log('OTP Code: ', otpForUser);
      }

      return;
    }

    throw new HttpException('user.validation.register.userNotExist', HttpStatus.BAD_REQUEST);
  }

  /**
   @description
   This function is responsible for validating a new user by OTP.
   @param {UserLoginDto} newUserPhoneNumberValidation - The user's phone number and other details to be validated.
   @returns {Promise<{ access_token: string; email: string | null; name: string; phone: string }>} The user's login data if the validation is successful, otherwise an error is thrown.
   */

  @Post('register/validate')
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async validateNewUserByOTP(@Body() newUserPhoneNumberValidation: UserLoginDto) {
    const newUserValidated = await this.authService.login(newUserPhoneNumberValidation);
    if (newUserValidated) {
      const user = await this.accountService.user({ phone: newUserValidated.phone });

      const dbUser = await this.accountService.updateUser({
        where: { phone: newUserValidated.phone },
        data: {
          ...user,
          isVerified: true,
        },
      });

      return this.authService.getUserLoginData(dbUser);
    }
    throw new HttpException('user.validation.register.userNotExist', HttpStatus.BAD_REQUEST);
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
    const user = await this.accountService.user({ phone: phoneNumber });
    const otpForUser = generateOTP(OTP_LENGTH);
    const message = `Your code is ${otpForUser}`;

    if (user) {
      await this.accountService.updateUser({
        where: { phone: user.phone },
        data: {
          ...user,
          validationCode: await hashPassword(otpForUser),
          codeExpiration: moment().add(OTP_FLOW_EXPIRATION_MINUTES, 'minutes').format(),
          lastSMSCodeRequest: moment().toDate(),
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
