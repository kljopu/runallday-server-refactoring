import { Module, DynamicModule, Global } from '@nestjs/common';
import { MyLoggerService } from './my-logger.service';

@Global()
@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService],
})
export class MyLoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: MyLoggerModule,
      providers: [MyLoggerService],
      exports: [MyLoggerService],
    };
  }
}
