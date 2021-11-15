import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAuthMiddleware } from '../../common/middleware/firebase-auth.middleware';
import { AccountModule } from '../account/account.module';
import { RecordV1Controller } from './api/record.v1.controller';
import { RecordApplicationService } from './application/record.application.service';
import { RecordService } from './domain/record/record.service';
import { RecordRepository } from './domain/record/reocrd.repository';
import { RunRouteRepository } from './domain/run-route/run-route.repository';
import { RunRouteService } from './domain/run-route/run-route.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordRepository, RunRouteRepository]),
    AccountModule,
  ],
  controllers: [RecordV1Controller],
  providers: [RecordApplicationService, RecordService, RunRouteService],
  exports: [RecordApplicationService, RecordService],
})
export class RecordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes({ path: 'v1/record/start', method: RequestMethod.POST });
  }
}
