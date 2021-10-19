import { ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseService } from './database.service';
import * as pg from 'pg';
import { getConnection } from 'typeorm';

const types = pg.types;

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        types.setTypeParser(1016, parseInt);
        types.setTypeParser(600, (val: any) => {
          if (val[0] !== '(') {
            return null;
          }
          val = val.substring(1, val.length - 1).split(',');
          return {
            lon: parseFloat(val[0]),
            lat: parseFloat(val[1]),
          };
        });
        config.get('database').verify();
        return config.get('database');
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
// implements OnApplicationBootstrap {
//   async onApplicationBootstrap() {
//     const isExistShareVehicleGroupEnum = (
//       await getConnection().query(`
//       select exists (select 1 from pg_type where typname = '');
//     `)
//     )[0].exists;
//   }
// }
