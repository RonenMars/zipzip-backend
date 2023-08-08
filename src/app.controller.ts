import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Prisma } from '@prisma/client';

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
    const user = await this.userService.user(phone);
    console.log('user', user);
    return 'Hello';
  }
}
