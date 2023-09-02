import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '@root/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/env.variables';
import { PrismaService } from '@root/prisma.service';
import { AccountService } from '@root/account/account.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AccountService],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(EnvVariables.JsonWebToken),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
