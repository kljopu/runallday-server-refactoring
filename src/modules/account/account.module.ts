import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FirebaseAuthMiddleware } from '../../common/middleware/firebase-auth.middleware';
import { PassVerificationModule } from '../../infra/pass-verification/pass-verification.module';
import { AccountService } from './domain/account.service';
import { RunnerModule } from './modules/runner/runner.module';

@Module({
  imports: [RunnerModule, PassVerificationModule],
  controllers: [],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes(
        { path: 'v1/account/admin-info', method: RequestMethod.GET },
        { path: 'v1/account/reset-password', method: RequestMethod.POST },
      );
  }
}
