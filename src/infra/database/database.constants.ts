import { ValueTransformer } from 'typeorm';
import * as moment from 'moment';

/**
 * postgresql의 typeorm 드라이버는 int8 타입 등을 문자열로 리턴하기 때문에 값을 number로
 * 변경해주는 작업을 진행해야 한다.
 */
export const bigintTransformer: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => {
    return parseInt(databaseValue, 10);
  },
};

export const momentTransformer: ValueTransformer = {
  to: (entityValue: Date) => entityValue,
  from: (databaseValue: string): moment.Moment => {
    return moment.utc(databaseValue);
  },
};

export enum PostgresErrorCode {
  'restrict_violation' = '23001',
  'not_null_violation' = '23502',
  'foreign_key_violation' = '23503',
  'unique_violation' = '23505',
  'check_violation' = '23514',
}
