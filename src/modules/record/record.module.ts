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

@Module({
  imports: [TypeOrmModule.forFeature([RecordRepository]), AccountModule],
  controllers: [RecordV1Controller],
  providers: [RecordApplicationService, RecordService],
  exports: [RecordApplicationService, RecordService],
})
export class RecordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes({ path: 'v1/record/start', method: RequestMethod.POST });
  }
}
