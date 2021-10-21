import { ConfigService } from 'nestjs-config';
import { MyLoggerService } from './utils/my-logger/my-logger.service';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(app.get(MyLoggerService)));
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  const PORT = appConfig.port;
  await app.listen(3000, () => {
    const loggerService = app.get(MyLoggerService);
    loggerService.log(`server listen on ${PORT}`, 'bootstrap');
  });
}
bootstrap();
