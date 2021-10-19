import { getConnection } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  constructor() {}

  public async getUUid() {
    const result = await getConnection().query(
      'select uuid_generate_v4() as uuid',
    );
    return result[0].uuid;
  }

  public async getDbTime(): Promise<Date> {
    // 데이터베이스 현재 시간.
    return (
      await getConnection()
        .createEntityManager()
        .query(
          `select (now() at time zone 'utc' at time zone 'utc') as "datetime"`,
        )
    )[0].datetime;
  }
}
