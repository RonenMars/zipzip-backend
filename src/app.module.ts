import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.get('twilio.accountSid'),
        authToken: cfg.get('twilio.authToken'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, UserService, PrismaService],
})
export class AppModule {}
