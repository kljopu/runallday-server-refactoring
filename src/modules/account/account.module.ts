// import { AdminModule } from './../admin/admin.module';
// import { AccountManageService } from './application/account-manage.service';
// import { AccountV1Controller } from './api/account.v1.controller';
// import {
//   MiddlewareConsumer,
//   Module,
//   NestModule,
//   RequestMethod,
// } from '@nestjs/common';
// import { FirebaseAuthMiddleware } from '../../common/middleware/firebase-auth.middleware';
// import { AccountV1DevController } from './api/account.v1.dev.controller';

// @Module({
//   imports: [AdminModule],
//   controllers: [AccountV1Controller, AccountV1DevController],
//   providers: [AccountManageService],
//   exports: [AccountManageService],
// })
// export class AccountModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(FirebaseAuthMiddleware)
//       .forRoutes(
//         { path: 'v1/account/admin-info', method: RequestMethod.GET },
//         { path: 'v1/account/reset-password', method: RequestMethod.POST },
//       );
//   }
// }
