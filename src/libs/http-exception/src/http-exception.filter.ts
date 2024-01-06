import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CustomExceptionBase } from '../../../exceptions/custom.exception.base';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(I18nService)
  private i18n: I18nService;

  async catch(exception, host: ArgumentsHost) {
    const errors = [];
    let message = 'Bad request';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception instanceof HttpException ||
      exception instanceof CustomExceptionBase
    ) {
      // this is using to catch all HttpException and CustomExceptionBase, to logs error and construct own response for FE
      // https://docs.nestjs.com/exception-filters
      const status: any =
        exception instanceof HttpException
          ? exception.getStatus()
          : exception.cause;
      const excep =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception.message;

      switch (status) {
        case 400:
          errors.push(excep);
          break;
        case 403:
          errors.push('Forbidden access');
          message = 'Forbidden access';
          break;
        default:
          errors.push(excep);
      }

      const responseBody = {
        statusCode: status,
        message: message,
        errors: errors,
      };

      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404 ||
        status === 409
      ) {
        Logger.warn(JSON.stringify(responseBody));
      } else {
        Logger.error(JSON.stringify(responseBody));
      }

      response.status(status).json(responseBody);
    } else {
      // this is using to catch all unhandled exception other than HttpException & CustomExceptionBase(which are not caught from app), to logs error and construct own response for FE
      // https://docs.nestjs.com/exception-filters#catch-everything
      const responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: await this.i18n.translate('lang.internal_server-error'),
        errors: [exception.message],
      };
      Logger.error(JSON.stringify(responseBody));
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBody);
    }
  }
}
