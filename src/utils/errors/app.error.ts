import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './errors.constants';
export class AppError extends HttpException {
  // 에러 코드
  public code: string;
  // 에러의 추가적인 설명.
  public description?: string;

  constructor(
    message?: string,
    status?: number,
    description?: string,
    stack?: any,
    code?: ErrorCode,
  ) {
    super(
      message || '내부적인 서버 오류입니다.',
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.code = code || ErrorCode['app/internal-error'];
    this.name = 'InternalServerError';
    this.description = description;
    if (stack) { this.stack = stack; }
    else { Error.captureStackTrace(this, this.constructor); }
  }

  public getStatus() {
    return super.getStatus();
  }
}
