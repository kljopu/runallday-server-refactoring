import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ErrorCode } from './errors.constants';
export class RequestTimeoutError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message,
      HttpStatus.REQUEST_TIMEOUT,
      description,
      null,
      code || ErrorCode['app/request-timeout'],
    );
    this.name = 'RequestTimeoutError';
    Error.captureStackTrace(this, this.constructor);
  }
}
