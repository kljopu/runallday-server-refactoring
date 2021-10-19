import { AppError } from '../utils/errors/app.error';
import * as path from 'path';

const config = {
  type: 'postgres',
  logging: process.env.TYPEORM_LOGGING === 'true' ? true : false,
  entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  synchronize: false,
  verify() {
    if (this.has('database.type') === false) {
      throw new AppError('database config의 type이 설정되지 않았습니다.');
    }

    if (process.env.NODE_ENV === 'production') {
      if (this.has('database.replication') === false) {
        throw new AppError(
          'database config의 replication이 설정되지 않았습니다.',
        );
      }
    } else {
      if (this.has('database.host') === false) {
        throw new AppError('database config의 host가 설정되지 않았습니다.');
      }
      if (this.has('database.port') === false) {
        throw new AppError('database config의 port가 설정되지 않았습니다.');
      }
      if (this.has('database.username') === false) {
        throw new AppError('database config의 username이 설정되지 않았습니다.');
      }
      if (this.has('database.password') === false) {
        throw new AppError('database config의 password가 설정되지 않았습니다.');
      }
      if (this.has('database.database') === false) {
        throw new AppError('database config의 database가 설정되지 않았습니다.');
      }
    }
  },
};

if (process.env.NODE_ENV === 'production') {
  //@ts-ignore
  config.replication = {
    master: {
      host: process.env.TYPEORM_HOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
      username: process.env.TYPEORM_USERNAME || 'postgres',
      password: process.env.TYPEORM_PASSWORD || 'postgres',
      database: process.env.TYPEORM_DATABASE || 'postgres',
    },
    slaves: [
      {
        host: process.env.TYPEORM_HOST_S1 || 'localhost',
        port: parseInt(process.env.TYPEORM_PORT_S1, 10) || 5432,
        username: process.env.TYPEORM_USERNAME_S1 || 'postgres',
        password: process.env.TYPEORM_PASSWORD_S1 || 'postgres',
        database: process.env.TYPEORM_DATABASE_S1 || 'postgres',
      },
    ],
  };
} else {
  //@ts-ignore
  config.host = process.env.TYPEORM_HOST || 'localhost';
  //@ts-ignore
  config.username = process.env.TYPEORM_USERNAME || 'postgres';
  //@ts-ignore
  config.password = process.env.TYPEORM_PASSWORD || 'postgres';
  //@ts-ignore
  config.database = process.env.TYPEORM_DATABASE || 'postgres';
  //@ts-ignore
  config.port = parseInt(process.env.TYPEORM_PORT, 10) || 5432;
}

export default config;
