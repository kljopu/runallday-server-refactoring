import * as moment from 'moment-timezone';
import { Point } from 'geojson';
import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RunningDateInfo } from './record.interface';
import { RunningState } from './record.constants';

@Entity({ name: 't_record' })
export class Record {
  @PrimaryColumn({ name: 'record_uid', type: 'uuid' })
  @Generated('uuid')
  public uid: string;

  //   @JoinColumn({ name: 'runner_id', referencedColumnName: 'id' })
  //   @ManyToOne(
  //     type => Runner,
  //     runner => runner.records,
  //     {
  //       nullable: true,
  //       onDelete: 'SET NULL',
  //       onUpdate: 'RESTRICT',
  //     },
  //   )
  //   @Index('ix_record_runner_id')
  //   public runner?: Runner;

  //   @Column({ name: 'runner_id', nullable: true })
  //   @RelationId((record: Record) => record.runner)
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
    comment: '러닝 동안 이동 거리(1m 단위)',
  })
  public runningDistance: number;

  @Column({
    name: 'running_time',
    nullable: true,
    comment: '러닝 시간(밀리초단위)',
  })
  public runningTime: number;

  @Column({
    name: 'running_speed',
    nullable: true,
    comment: '단위(km)당 평균 속도',
  })
  public runningSpeed: number;

  @Column({
    name: 'state',
    type: 'enum',
    enum: RunningState,
    nullable: false,
  })
  public state: RunningState;

  /**
   * @static
   * @param {Date} startedAt
   * @param {Date} endedAt
   * @returns {RunningDateInfo} 시작 시각, 종료 시각 포맷.
   * @memberof Rent
   * @description 시작 시각, 종료 시각을 포맷에 맞게 날짜 문자열로 변환한다.
   */
  public static convertRunningDateToLocaleString(
    startedAt: Date,
    endedAt: Date,
  ): RunningDateInfo {
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
}
