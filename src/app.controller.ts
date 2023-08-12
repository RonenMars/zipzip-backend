import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { JoiValidationPipe } from './validations/joi-schema.validation';
import { UserCreateDto } from './validations/user/dto/create.dto';
import { UserSchema } from './validations/user/user.schema';
import { getPhoneNumber, isValidPhoneNumber } from './utils/phone';
import { getRandomCode } from './utils/codes';
import * as moment from 'moment';
import { PhoneSchema } from './validations/user/phone.schema';

@Controller('/user')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get('/send-sms')
  sendSMS() {
    this.appService.sendSMS();
  }

  @Post()
  @UsePipes(new JoiValidationPipe(UserSchema))
  createUser(@Body() user: UserCreateDto) {
    if (isValidPhoneNumber(user.phone)) {
      user.codeExpiration = moment().format();
      user.validationCode = getRandomCode();

      this.userService.createUser(user);
    }
  }

  @Get(':phone')
  @UsePipes(new JoiValidationPipe(PhoneSchema))
  async loginUser(@Param('phone') phone: string) {
    if (isValidPhoneNumber(phone)) {
      const phoneNumber = getPhoneNumber(phone);
      const user = await this.userService.user(phoneNumber);
      console.log(user);
    }
    return 'Hello';
  }
}
