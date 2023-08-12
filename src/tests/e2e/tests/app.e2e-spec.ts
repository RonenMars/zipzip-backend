import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { UserService } from '@root/user.service';
import { PrismaService } from '@root/prisma.service';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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
      controllers: [AppController],
      providers: [AppService, UserService, PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/valid-phoneNumber (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/0505822444')
      .expect(200)
      .expect('true');
  });

  it('/user/invalid-phoneNumber (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/05055822444')
      .expect(400)
      .expect({
        message: [{ name: 'phone', message: 'מספר חייב להיות בן 10 ספרות' }],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
