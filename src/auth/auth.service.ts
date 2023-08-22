import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '@root/prisma.service';
import { verifyPassword } from '@utils/index';
import { UserPhoneDto } from '@validations/user/dto/login.phone.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginDto: UserPhoneDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: loginDto.phone },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
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
