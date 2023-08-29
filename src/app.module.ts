import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@root/prisma.service';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthController, AuthModule, AuthService } from '@root/auth';
import { LoggerMiddleware } from '@utils/logger';
import { AccountService, AccountController } from '@root/account';
import { JwtModule } from '@nestjs/jwt';
import { TwilioModule } from 'nestjs-twilio';
import { config } from '@root/config/config';
import { EnvVariables } from '@enums/env.variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
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
        accountSid: configService.get(EnvVariables.TwilioAccountSid),
        authToken: configService.get(EnvVariables.TwilioAuthToken),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController, AccountController],
  providers: [AppService, PrismaService, AuthService, AccountService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
