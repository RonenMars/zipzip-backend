import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '@root/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariables } from '@enums/env.variables';
import { PrismaService } from '@root/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get(EnvVariables.JsonWebToken),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
