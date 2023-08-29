import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { PrismaService } from '@root/prisma.service';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AccountController } from '@root/account/account.controller';
import { AccountService } from '@root/account/account.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const mockPrismaService = {
      provide: PrismaService,
      useFactory: () => ({
        user: {
          findUnique: jest.fn(() => ({
            codeExpiration: '2023-08-08T01:16:36.000Z',
            email: 'ronenmars@gmail.com',
            id: 99,
            isVerified: false,
            name: 'Ronen Mars',
            phone: '+972505822444',
            validationCode: '123456',
          })),
          update: jest.fn(() => ({})),
        },
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
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
            path: path.join('src/i18n/'),
            watch: true,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
      controllers: [AccountController],
      providers: [AccountService, mockPrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/account/login/valid-phoneNumber (GET)', () => {
    return request(app.getHttpServer())
      .get('/account/0505822444')
      .expect(200)
      .expect({ userId: 99 });
  });

  it('/account/invalid-phoneNumber (GET)', () => {
    return request(app.getHttpServer())
      .get('/account/05055822444')
      .expect(400)
      .expect({
        message: [{ name: 'phone', message: 'user.validation.phone.length' }],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
