import { ErrorCode } from './errors.constants';
import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
export class ForbiddenError extends AppError {
  constructor(message: string, description?: string, code?: ErrorCode) {
    super(
      message || '요청이 금지됐습니다.',
      HttpStatus.FORBIDDEN,
      description,
      null,
      code || ErrorCode['app/forbidden'],
    );
    this.name = 'ForbiddenError';
    Error.captureStackTrace(this, this.constructor);
  }
}
