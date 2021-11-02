import * as moment from 'moment-timezone';
import { Point } from 'geojson';
import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { IRunningDateInfo } from './record.interface';
import { RecordTypeEnum, RunningState } from './record.constants';
import { Runner } from '../../../account/modules/runner/domain/runner.entity';
import { RunRoute } from '../run-route/run-route.entity';
import { ConflictError } from '../../../../utils/errors';

@Entity({ name: 't_record' })
export class Record {
  @PrimaryColumn({ name: 'record_uid', type: 'uuid' })
  @Generated('uuid')
  public uid: string;

  @JoinColumn({ name: 'runner_id', referencedColumnName: 'id' })
  @ManyToOne(
    type => Runner,
    runner => runner.records,
    {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    },
  )
  @Index('ix_record_runner_id')
  public runner?: Runner;

  @Column({ name: 'runner_id', nullable: true })
  @RelationId((record: Record) => record.runner)
  public runnerId?: number;

  @Column({
    type: 'timestamptz',
    name: 'start_datetime',
    default: () => 'now()',
  })
  public startedAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'end_datetime',
    default: () => 'now()',
  })
  public endedAt: Date;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    name: 'start_coordinates',
  })
  public startCoordinates: Point;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    name: 'end_coordinates',
  })
  public endCoordinates: Point;

  @Column({
    name: 'running_distance',
    nullable: true,
    default: 0,
    comment: '러닝 동안 이동 거리(1m 단위)',
  })
  public runningDistance: number;

  @Column({
    name: 'running_time',
    nullable: true,
    default: 0,
    comment: '러닝 시간(초단위)',
  })
  public runningTime: number;

  @Column({
    name: 'running_speed',
    nullable: true,
    default: 0,
    comment: '단위(km)당 평균 속도',
  })
  public runningSpeed: number;

  @Column({
    name: 'state',
    type: 'enum',
    enum: RunningState,
    nullable: true,
  })
  public state: RunningState;

  // TODO DB data type t_recordTypeEnum 생성
  @Column({
    name: 'record_type',
    type: 'enum',
    enum: RecordTypeEnum,
    nullable: false,
  })
  public recordType: RecordTypeEnum;

  @Column({
    name: 'goal',
    default: 0,
    nullable: true,
    comment: 'recordType에 따라 시간일 수도 거리일 수도 있다.',
  })
  public goal: number;

  @Column('int', {
    name: 'speed_per_km',
    array: true,
    default: [],
  })
  public speedPerKm: number[] | (() => number);

  @OneToOne(type => RunRoute, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'run_route_id', referencedColumnName: 'id' })
  runRoute: RunRoute;

  @RelationId((record: Record) => record.runRoute)
  @Column({ name: 'run_route_id', nullable: true })
  public runRouteId: number;

  /**
   * @static
   * @param {Date} startedAt
   * @param {Date} endedAt
   * @returns {IRunningDateInfo} 시작 시각, 종료 시각 포맷.
   * @memberof Rent
   * @description 시작 시각, 종료 시각을 포맷에 맞게 날짜 문자열로 변환한다.
   */
  public static convertRunningDateToLocaleString(
    startedAt: Date,
    endedAt: Date,
  ): IRunningDateInfo {
    // REVIEW: 글로벌 서비스라면 UTC로 변경해야함.
    const startMoment = moment.utc(startedAt).tz('Asia/Seoul');
    const endMoment = moment.utc(endedAt).tz('Asia/Seoul');
    const dur = moment.duration(startMoment.diff(endMoment));
    const hours = dur.hours();
    const minuteStr =
      dur.asMinutes() >= 10 ? Math.floor(dur.asMinutes()) : `0${dur.minutes()}`;
    const secondStr =
      dur.seconds() >= 10 ? Math.floor(dur.seconds()) : `0${dur.seconds()}`;
    const startTime = startMoment.format('YYYY.MM.DD HH:mm:ss');
    const endTime = endMoment.format('YYYY.MM.DD HH:mm:ss');
    const totalTime =
      hours >= 1
        ? `${hours}시 ${minuteStr}분 ${secondStr}초`
        : `${minuteStr}분 ${secondStr}초`;
    return { startTime, endTime, totalTime };
  }

  public setStateToStop() {
    this.state = RunningState.STOP;
  }

  public async start(
    runner,
    startCoordinates,
    recordType,
    goal?,
  ): Promise<void> {
    this.startedAt = new Date(); // DB 저장 시각과 동일시 해야 된다. 따라서 DB 저장 이후 객체의 시각을 객체에 넣어 줘야 할 지 결정 해야 함.
    this.runner = runner;
    this.startCoordinates = startCoordinates;
    this.setRecordTypeAndGoal(recordType, goal);
  }

  private isRecordTypeFree(recordType): boolean {
    return recordType === RecordTypeEnum.FREE;
  }

  private setRecordTypeAndGoal(recordType: RecordTypeEnum, goal: number): void {
    if (this.isRecordTypeFree(recordType)) {
      this.recordType = RecordTypeEnum.FREE;
      this.goal = 0;
    } else {
      this.recordType = recordType;
      this.goal = goal;
    }
  }

  public isRunFinished(): boolean {
    if (this.state === RunningState.FINISH) {
      return true;
    }
    return false;
  }

  // 스피드 계산 함수 추가
  public calculateSpeed(): void {
    // 아무래도 기록 쪽 관리를 front localstorage에서 하는 방법이 더욱 안정성이 있는 것 같다.
    // 이를 특정 기준(초, 거리)마다 서버와 통신을 통해 저장
  }

  public setSpeedPerKm(speedPerKm: number[]): void {
    // 기본적으로 들어온 Array를 교채하는 방식으로 한다.
    // 이경우 들어오는 오류로 인해 빈값이 올 경우를 확인하는 로직이 필요하다.
    if (speedPerKm.length === 0) {
      throw new ConflictError(
        '잘못된 값을 입력하였습니다.',
        '적어도 하나 이상의 속도값이 필요합니다.',
      );
    } else {
      // speed array 값이 들어 옴
      // Array의 모든 값이 0인 경우 throw -> DTO에서 검사
      // length가 더 짧아진 경우 throw
      if (this.speedPerKm.length > speedPerKm.length) {
        throw new ConflictError(
          '잘못된 값을 입력하였습니다.',
          '기존 속도 기록보다 더 짧아진 기록을 입력할 수 없습니다.',
        );
      }
    }
    this.speedPerKm = speedPerKm;
  }
}
