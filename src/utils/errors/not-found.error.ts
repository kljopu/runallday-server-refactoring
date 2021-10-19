import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ErrorCode } from './errors.constants';
export class NotFoundError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      description,
      null,
      code || ErrorCode['app/not-found'],
    );
    this.name = 'NotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
