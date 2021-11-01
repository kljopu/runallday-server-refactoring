import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordApplicationService } from './application/record.application.service';
import { RecordService } from './domain/record/record.service';
import { RecordRepository } from './domain/record/reocrd.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecordRepository])],
  controllers: [],
  providers: [RecordApplicationService, RecordService],
  exports: [RecordApplicationService, RecordService],
})
export class RecordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(FirebaseAuthMiddleware)
    //   .forRoutes({ path: '', method: RequestMethod.GET });
  }
}
