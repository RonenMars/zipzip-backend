import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'lodash';
import { translate } from '@i18n/translate';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let responseMessage;

    if (exception.name === 'BadRequestException') {
      responseMessage = get(exception, 'response.message');
    } else if (exception.name === 'HttpException') {
      responseMessage = get(exception, 'response');
    }

    if (!responseMessage) {
      responseMessage = 'server.serverErrorTryAgain';
    }

    let message;

    if (Array.isArray(responseMessage)) {
      message = responseMessage.map(
        (error: { name: string; message: string }) => ({
          ...error,
          message: translate(error.message),
        }),
      );
    } else {
      message = translate(responseMessage);
    }

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
