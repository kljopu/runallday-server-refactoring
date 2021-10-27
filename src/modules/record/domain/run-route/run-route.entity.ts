import { LineString } from 'geojson';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Record } from '../record/record.entity';

@Entity({ name: 't_run_route' })
export class RunRoute {
  @Generated('increment')
  @PrimaryColumn({ name: 'run_route_id' })
  public id: number;

  @OneToOne(type => Record, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public record: Record;

  @RelationId((rr: RunRoute) => rr.record)
  @Column({ name: 'record_uid' })
  public recordUid: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
  })
  public path: LineString;

  @Column({
    type: 'timestamptz',
    name: 'record_start_datetime',
    comment: '기록 시작 시간',
    default: () => 'now()',
  })
  public recordStartAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'record_end_datetime',
    comment: '기록 종료 시간. 혹은 멈춤 시간. 위치 추가 시 업데이트해야 함.',
    default: () => 'now()',
  })
  public recordEndAt: Date;
}
