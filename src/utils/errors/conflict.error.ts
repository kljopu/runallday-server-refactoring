import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ErrorCode } from './errors.constants';
export class ConflictError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message,
      HttpStatus.CONFLICT,
      description,
      null,
      code || ErrorCode['app/conflict'],
    );
    this.name = 'ConflictError';
    Error.captureStackTrace(this, this.constructor);
  }
}
