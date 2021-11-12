import { ConfigService } from 'nestjs-config';
import { MyLoggerService } from './utils/my-logger/my-logger.service';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: true,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(app.get(MyLoggerService)));
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  const PORT = appConfig.port;
  await app.listen(3000, () => {
    const loggerService = app.get(MyLoggerService);
    loggerService.log(`server listen on ${PORT}`, 'bootstrap');
  });
}
bootstrap();
