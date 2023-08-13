import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { UserService } from '@root/user.service';
import { PrismaService } from '@root/prisma.service';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as moment from 'moment';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
        I18nModule.forRoot({
          fallbackLanguage: 'he',
          loaderOptions: {
            path: path.join(__dirname, '../i18n/'),
            watch: true,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
      controllers: [AppController],
      providers: [AppService, UserService, PrismaService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Valid phone number should return "true"', async () => {
      const functionResponse = await appController.loginUser('0505822445');
      expect(functionResponse).toStrictEqual({
        codeExpiration: moment('2023-08-08T01:16:36.000Z').toDate(),
        email: 'ronenmars@gmail.com',
        id: 1,
        isVerified: false,
        name: 'Ronen Mars',
        phone: '+972505822445',
        validationCode: '123456',
      });
    });
  });

  describe('root', () => {
    it('Invalid phone number should return "false"', async () => {
      const functionResponse = await appController.loginUser('0 05822445');
      expect(functionResponse).toBe('false');
    });
  });
});
