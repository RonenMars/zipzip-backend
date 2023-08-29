import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@root/exception.handler';
const prisma = new PrismaClient();

require('module-alias/register');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(function (request: Request, response: Response, next: NextFunction) {
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    let err = null;

    try {
      decodeURIComponent(request.path);
    } catch (e) {
      err = e;
    }
    if (err) {
      console.log(err, request.url);
      throw new HttpException(
        { message: 'auth.decodeIssue' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(port);
}
bootstrap()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
