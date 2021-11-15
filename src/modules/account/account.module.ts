import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FirebaseAuthMiddleware } from '../../common/middleware/firebase-auth.middleware';
import { FirebaseModule } from '../../infra/firebase/firebase.module';
import { PassVerificationModule } from '../../infra/pass-verification/pass-verification.module';
import { AccountDevController } from './api/account.dev.controller';
import { AccountV1Controller } from './api/account.v1.controller';
import { PassVerifyV1Controller } from './api/pass-verify.v1.controller';
import { AccountApplicationService } from './application/account.application.service';
import { AccountService } from './domain/account.service';
import { RunnerModule } from './modules/runner/runner.module';

@Module({
  imports: [RunnerModule, PassVerificationModule],
  controllers: [
    AccountV1Controller,
    AccountDevController,
    PassVerifyV1Controller,
  ],
  providers: [AccountService, AccountApplicationService],
  exports: [AccountService, AccountApplicationService],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseAuthMiddleware).exclude(
      {
        path: 'v1/account/sign-in',
        method: RequestMethod.POST,
      },
      {
        path: 'v1/account/sign-in',
        method: RequestMethod.POST,
      },
    );
    // forRoutes({
    //   path: 'v1/account/reset-password',
    //   method: RequestMethod.POST,
    // });
  }
}
