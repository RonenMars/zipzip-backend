import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import * as moment from 'moment';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';

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

  @Get()
  createUser() {
    this.userService.createUser({
      phone: '+972501234567',
      name: 'Ronen Mars',
      email: 'ronenmars@gmail.com',
      validationCode: '123456',
      codeExpiration: moment().format(),
    });
  }

  @Get(':phone')
  async loginUser(@Param('phone') phone: string) {
    console.log(phone);
    const phoneNumber = parsePhoneNumber(phone, 'IL');
    if (phoneNumber && phoneNumber.isPossible()) {
      const user = await this.userService.user(phoneNumber.number);
      console.log('user', user);
      console.log('random number', Math.random().toString().slice(2, 6));
    }
    return 'Hello';
  }
}
