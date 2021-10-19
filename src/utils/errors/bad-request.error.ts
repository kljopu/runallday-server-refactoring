import { HttpStatus } from '@nestjs/common';
import { AppError } from './app.error';
import { ErrorCode } from './errors.constants';
export class BadRequestError extends AppError {
  constructor(message?: string, description?: string, code?: ErrorCode) {
    super(
      message || '잘못된 요청입니다.',
      HttpStatus.BAD_REQUEST,
      description,
      null,
      code || ErrorCode['app/bad-request'],
    );
    this.name = 'BadRequestError';
    Error.captureStackTrace(this, this.constructor);
  }
}
