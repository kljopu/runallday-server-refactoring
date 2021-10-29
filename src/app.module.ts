import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { AppService } from './app.service';
import { MyLoggerModule } from './utils/my-logger/my-logger.module';
import { DatabaseModule } from './infra/database/database.module';
import { DomainModule } from './modules/domain.module';
import { FirebaseAdminModule } from './infra/firebase-admin/firebase-admin.module';

@Module({
  imports: [
    ConfigModule.resolveRootPath(__dirname).load('./config/*.config.{ts,js}', {
      modifyConfigName: name => name.replace('.config', ''),
      path:
        // eslint-disable-next-line no-nested-ternary
        process.env.NODE_ENV === 'production'
          ? path.join(__dirname, '../.env.production')
          : process.env.NODE_ENV === 'staging'
          ? path.join(__dirname, '../.env.staging')
          : path.join(__dirname, '../.env'),
    }),
    FirebaseAdminModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        config.get('firebase-admin').verify();
        return config.get('firebase-admin');
      },
      inject: [ConfigService],
    }),
    MyLoggerModule,
    DatabaseModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
