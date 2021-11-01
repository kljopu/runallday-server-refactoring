import { PassVerificationErrorCode } from './error-code';

export class PassVerificationError extends Error {
  public readonly name: string;
  public readonly code: PassVerificationErrorCode;

  constructor(message: string, code: PassVerificationErrorCode) {
    super(message);
    this.name = 'PassVerificationError';
    Error.captureStackTrace(this, this.constructor);
  }
}
