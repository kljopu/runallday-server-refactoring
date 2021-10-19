import { ErrorCode } from './errors.constants';
import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
export class NotAcceptableError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message,
      HttpStatus.NOT_ACCEPTABLE,
      description,
      null,
      code || ErrorCode['app/not-acceptable'],
    );
    this.name = 'NotAcceptableError';
    Error.captureStackTrace(this, this.constructor);
  }
}
