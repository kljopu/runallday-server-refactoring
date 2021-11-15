import { Exclude, Expose } from 'class-transformer';
import { LineString, Point } from 'geojson';
import { Record } from '../../domain/record/record.entity';

export class RecordStartResponseDto {
  // TODO: 안쓰는 변수 삭제
  @Exclude() private _runnerId: number;
  @Exclude() private _startedAt: Date;
  @Exclude() private _endedAt: Date;
  @Exclude() private _startCoordinates: Point;
  @Exclude() private _endCoordinates: Point;
  @Exclude() private _runningDistance: number;
  @Exclude() private _runningTime: number;
  @Exclude() private _runningSpeed: number;
  @Exclude() private _path: LineString;

  constructor(record: Record) {
    this._runnerId = record.runnerId;
    this._startedAt = record.startedAt;
    this._startCoordinates = record.startCoordinates;
  }

  @Expose()
  get runnerId(): number {
    return this._runnerId;
  }

  @Expose()
  get startAt(): Date {
    return this._startedAt;
  }

  @Expose()
  get startCoordinates(): Point {
    return this._startCoordinates;
  }
}
