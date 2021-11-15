import { Injectable } from '@nestjs/common';
import { LineString, Point } from 'geojson';
import { EntityManager } from 'typeorm';
import { isNotNull } from '../../../utils';
import { ErrorCode, NotFoundError } from '../../../utils/errors';
import { MyLoggerService } from '../../../utils/my-logger/my-logger.service';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordTypeEnum } from '../domain/record/record.constants';
import { Record } from '../domain/record/record.entity';
import { RecordService } from '../domain/record/record.service';
import { RunRouteService } from '../domain/run-route/run-route.service';
import { RecordStartResponseDto } from '../dto';

@Injectable()
export class RecordApplicationService {
  constructor(
    private readonly logger: MyLoggerService,
    private readonly recordService: RecordService,
    private readonly runRouteService: RunRouteService,
  ) {}

  public async getRecordsByRunner(runner: Runner) {
    return await this.recordService.getUserRecords(runner);
  }

  public async startRecord(
    runner: Runner,
    startAt: Date,
    startCoordinate: Point,
    type: RecordTypeEnum,
    goal?: number,
  ): Promise<RecordStartResponseDto> {
    const record: Record = await this.recordService.startRecord(
      runner,
      startAt,
      startCoordinate,
      type,
      goal,
    );

    this.logger.log(
      '%s 유저가 기록을 시작하였습니다.',
      RecordApplicationService.name,
      runner.id,
    );
    return new RecordStartResponseDto(record);
  }

  public async endRecord(
    entityManager: EntityManager,
    runner: Runner,
    recordUid: string,
    endCoordinates: Point,
    endAt: Date,
    path: LineString,
    speedPerKm: number[],
    isSucceeded: boolean,
  ): Promise<any> {
    const record: Record = await this.recordService.findByUid(recordUid);
    if (isNotNull(record) === false) {
      throw new NotFoundError(
        `존재하지 않는 기록입니다`,
        `기록 종료를 요청한 ${recordUid}는 존재하지 않는 기록입니다.`,
        ErrorCode['app/not-found'],
      );
    }
    // TODO: RecordRoute Service를 통해 RecordRoute를 가져와서 해당 RecordRoute를 RecordService로 전달
    // 이후 트랜색션도 붙여야 함.
    const updatedRoute = await this.runRouteService.updateRoute(
      entityManager,
      recordUid,
      path,
    );

    // route에 경로 정보 저장 후 객체 전달
    // EntityManager -> 트랜색션 필요
    await this.recordService.endRecord(
      entityManager,
      runner,
      record,
      updatedRoute,
      endCoordinates,
      endAt,
      speedPerKm,
      isSucceeded,
    );
  }
}
