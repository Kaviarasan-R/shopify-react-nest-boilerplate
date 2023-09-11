import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from '@shopify/shopify-api';

@Catch(HttpException)
export class AuthException extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error(`---> Error at /auth`, exception.message);
    if (exception instanceof CookieNotFound) {
      const shop = request.query.shop;
      response.redirect(`/exitframe/${shop}`);
    } else if (
      exception instanceof InvalidOAuthError ||
      exception instanceof InvalidSession
    ) {
      const shop = request.query.shop;
      response.redirect(`/auth?shop=${shop}`);
    } else {
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).send(exception.message);
    }
  }
}
