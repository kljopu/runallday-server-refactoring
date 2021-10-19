import { ErrorCode } from './../../utils/errors/errors.constants';
import { MyLoggerService } from '../../utils/my-logger/my-logger.service';
import { AppError } from '../../utils/errors/app.error';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Inject,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(@Inject() private readonly logger: MyLoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const status = exception.getStatus();
    let status =
      exception instanceof AppError
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let description =
      exception instanceof AppError
        ? exception.description
        : JSON.stringify(exception);
    let message =
      exception instanceof AppError
        ? exception.message
        : '알 수 없는 오류가 발생했습니다.';
    let code =
      exception instanceof AppError
        ? exception.code
        : ErrorCode['app/internal-error'];

    if (exception instanceof NotFoundException) {
      message = 'Not Found';
      description = JSON.stringify(exception.message);
      status = HttpStatus.NOT_FOUND;
      code = ErrorCode['app/not-found'];
    } else if (exception instanceof BadRequestException) {
      message = 'Bad Request';
      description = JSON.stringify(exception.message);
      status = HttpStatus.BAD_REQUEST;
      code = ErrorCode['app/bad-request'];
    }

    if (host.getType() === 'http') {
      const incomingMessage: IncomingMessage = host.getArgs()[0];
      const method = incomingMessage.method ? incomingMessage.method : '-';
      const url = incomingMessage.url ? incomingMessage.url : '-';
      description += ` from: ${method} ${url}`;
    }

    this.logger.error(
      message,
      AllExceptionFilter.name,
      exception.stack,
      description,
    );

    response.status(status).json({
      success: false,
      code,
      status,
      msg: message,
    });
  }
}
