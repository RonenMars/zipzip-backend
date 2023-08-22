import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { getPhoneNumber, verifyPassword } from '@utils/index';
import { UserLoginDto } from '@validations/user/dto/index';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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

    return {
      success: true,
      // access_token: await this.jwtService.signAsync(payload),
    };
    // const validPassword = await verifyPassword(
    //   loginDto.password,
    //   user.password,
    // );
    //
    // if (!validPassword) {
    //   throw new HttpException(
    //     'Invalid email or password',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    //
    // if (!user.twoFA) {
    //   const payload = {
    //     email: user.email,
    //     first_name: user.firstName,
    //     last_name: user.lastName,
    //     sub: user.id,
    //   };
    //   return {
    //     success: true,
    //     access_token: await this.jwtService.signAsync(payload),
    //   };
    // }
  }
}
