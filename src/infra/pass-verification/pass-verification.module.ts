import { PassVerificationService } from './pass-verification.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PassVerificationService],
  exports: [PassVerificationService],
})
export class PassVerificationModule {}
