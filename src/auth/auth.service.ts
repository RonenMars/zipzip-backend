import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber, verifyPassword } from '@root/utils';
import { UserLoginDto } from '@validations/user/dto';
import { AccountService } from '@root/account/account.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly accountService: AccountService,
  ) {}

  /**
   * Authenticate a user by logging them in.
   *
   * @param {UserLoginDto} loginDto - The user's login data.
   * @returns {Promise<{ success: boolean, access_token: string }>} A response containing an access token if authentication is successful.
   * @throws {HttpException} Throws an exception with a status code and message for various authentication failures.
   */
  async login(loginDto: UserLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: getPhoneNumber(loginDto.phone) },
    });

    if (!user) {
      throw new HttpException('auth.UserNotFound', HttpStatus.BAD_REQUEST);
    }

    if (user.validationCode === null) {
      throw new HttpException('auth.UserMissingValidationCode', HttpStatus.BAD_REQUEST);
    } else {
      const isValidationCodeExpired = user.codeExpiration && moment(moment()).isBefore(user.codeExpiration);

      if (isValidationCodeExpired) {
        const validPassword = await verifyPassword({
          password: loginDto.validationCode,
          hash: user.validationCode,
        });

        if (!validPassword) {
          throw new HttpException('auth.UserBadValidationCode', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('auth.ValidationCodeExpired', HttpStatus.BAD_REQUEST);
      }
    }

    await this.accountService.updateUser({
      where: { phone: user.phone },
      data: {
        ...user,
        validationCode: null,
        codeExpiration: null,
      },
    });

    const payload = {
      email: user.email,
      name: user.name,
      phone: user.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
      ...payload,
    };
  }
}
