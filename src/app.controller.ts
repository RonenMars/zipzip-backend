import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';

import { AppService } from '@root/app.service';
import { UserService } from '@root/user.service';

import { JoiValidationPipe } from '@validations/joi-schema.validation';
import { UserCreateDto } from '@validations/user/dto';
import { PhoneSchema, UserSchema } from '@validations/user';

import { getPhoneNumber, getRandomCode } from '@utils/index';
import * as moment from 'moment';

/**
 * Controller responsible for handling user-related routes and requests.
 *
 * @class
 * @constructor
 * @param {AppService} appService - An instance of the AppService for handling application-level operations.
 * @param {UserService} userService - An instance of the UserService for managing user-related operations.
 *
 * @example
 * import { Controller } from '@nestjs/common';
 * import { AppService, UserService } from '.app.module.ts';
 * import { AppController } from './app.controller.ts';
 *
 * @Controller('/user')
 * export class UserController {
 *   constructor(private readonly appService: AppService, private readonly userService: UserService) {}
 * }
 */
@Controller('/user')
export class AppController {
  /**
   * Constructor for the AppController class.
   *
   * @constructor
   * @param {AppService} appService - An instance of the AppService for handling application-level operations.
   * @param {UserService} userService - An instance of the UserService for managing user-related operations.
   */
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  /**
   * Sends an SMS. This route is used a validation using sms validation code.
   *
   * @public
   * @function
   */
  @Get('/send-sms')
  sendSMS() {
    this.appService.sendSMS();
  }

  /**
   * Creates a new user with the provided user data.
   *
   * @public
   * @function
   * @param {UserCreateDto} user - The user data to create a new user.
   */
  @Post()
  @UsePipes(new JoiValidationPipe(UserSchema))
  createUser(@Body() user: UserCreateDto) {
    user.codeExpiration = moment().format();
    user.validationCode = getRandomCode();

    this.userService.createUser(user);
  }

  /**
   * Logs in a user based on their phone number.
   *
   * @public
   * @function
   * @async
   * @param {string} phone - The phone number of the user to log in.
   * @returns {Promise<string | any>} The user data if login is successful; otherwise, 'false'.
   */
  @Get(':phone')
  @UsePipes(new JoiValidationPipe(PhoneSchema))
  async loginUser(@Param('phone') phone: string) {
    const phoneNumber = getPhoneNumber(phone);
    const user = await this.userService.user(phoneNumber);
    console.log(user);
    return user;
  }
}
