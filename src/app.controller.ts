import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import * as moment from 'moment';

@Controller()
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
}
