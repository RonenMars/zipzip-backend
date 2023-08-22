import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '@root/user.service';
import { PrismaService } from '@root/prisma.service';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AccountModule } from './account/account.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from '@utils/logger';
import { AccountController } from '@root/account/account.controller';
import { AuthService } from '@root/auth/auth.service';
import { AccountService } from '@root/account/account.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'he',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
    JwtModule,
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('twilio.accountSid'),
        authToken: configService.get('twilio.authToken'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController, AccountController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    AuthService,
    AccountService,
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
