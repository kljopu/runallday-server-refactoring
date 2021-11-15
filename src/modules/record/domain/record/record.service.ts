import { Injectable } from '@nestjs/common';
import { LineString, Point } from 'geojson';
import { EntityManager, FindOneOptions } from 'typeorm';
import {
  ConflictError,
  ErrorCode,
  ForbiddenError,
} from '../../../../utils/errors';
import { Runner } from '../../../account/modules/runner/domain/runner.entity';
import { RunRoute } from '../run-route/run-route.entity';
import { RecordTypeEnum } from './record.constants';
import { Record } from './record.entity';
import { Records } from './records.collection';
import { RecordRepository } from './reocrd.repository';

@Injectable()
export class RecordService {
  constructor(private readonly recordRepository: RecordRepository) {}

  private async findOne(
    findOneOptions: FindOneOptions<Record>,
  ): Promise<Record> {
    return await this.recordRepository.findOne(findOneOptions);
  }

  // user는 도메인 객체이다 도메인 객체가 다른 도메인 객체와 메시지를 주고 받기 위해서는 다른 도메인 객체의 함수를 이용해야 한다.
  // {고민} 이미 유저 객체에서 최근 대여를 가져왔는데 다시 유저 객체를 통해 record를 조회하는게 맞을까? db 히트 수만 많아지는거 아닌가?
  // DB join을 통해서 가져오는 것은 그냥 해당 객체라고 판단하는 것이 맞다고 생각한다.
  public async getUserRecords(runner: Runner): Promise<Records | []> {
    const records = await this.recordRepository.find({ runnerId: runner.id });
    if (records.length === 0) {
      return [];
    }
    const recordList = new Records(records);
    recordList.list;
  }

  public async findByUid(recordUid: string): Promise<Record> {
    return await this.recordRepository.findByUid(recordUid);
  }

  /**
   * // TODO: Promise return 객체 바꿔줘야 함.
   * @param runner
   * @param runType
   * @param startCoordinates
   * @param goal
   * @returns {}
   * @description 기록을 시작하는 메서드
   */
  public async startRecord(
    runner: Runner,
    startAt: Date,
    startCoordinates: Point,
    runType: RecordTypeEnum,
    goal?: number,
  ): Promise<Record> {
    const record = new Record();
    await record.start(runner, startAt, startCoordinates, runType, goal);
    const savedRecord = await this.recordRepository.save(record);
    return savedRecord;
  }

  // TODO
  public async stopRecord(): Promise<any> {
    return;
  }

  public async endRecord(
    entityManager: EntityManager,
    runner: Runner,
    record: Record,
    route: RunRoute,
    endCoordinates: Point,
    endAt: Date,
    speedPerKm: number[],
    isSucceeded: boolean,
  ): Promise<Record> {
    if (!record.isOwnRecord(runner)) {
      throw new ForbiddenError(
        `잘못된 기록 UID 입니다.`,
        `기록 ${record.uid}는 유저 ${runner.id}에 소유되지 않는 기록입니다.`,
        ErrorCode['record/forbidden-record'],
      );
    }
    await record.end(endCoordinates, endAt, route, speedPerKm, isSucceeded);
    const savedRecord = await entityManager
      .getCustomRepository(RecordRepository)
      .save(record);
    return savedRecord;
  }
}
