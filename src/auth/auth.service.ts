import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber, verifyPassword } from '@utils/index';
import { UserLoginDto } from '@validations/user/dto/index';
import { AccountService } from '@root/account/account.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly accountService: AccountService,
  ) {}

  async login(loginDto: UserLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: getPhoneNumber(loginDto.phone) },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.validationCode === null) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const validPassword = await verifyPassword({
        password: loginDto.validationCode,
        hash: user.validationCode,
      });

      if (!validPassword) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.BAD_REQUEST,
        );
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
      sub: user.id,
    };

    return {
      success: true,
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
