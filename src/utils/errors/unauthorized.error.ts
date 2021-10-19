import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ErrorCode } from './errors.constants';
export class UnauthorizedError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      description,
      null,
      code || ErrorCode['app/unauthorize'],
    );
    this.name = 'UnauthorizedError';
    Error.captureStackTrace(this, this.constructor);
  }
}
