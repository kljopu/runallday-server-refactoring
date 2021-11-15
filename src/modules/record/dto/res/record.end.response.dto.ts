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
  @Exclude() private _speedPerKm: number[];
  @Exclude() private _path: LineString;
  @Exclude() private _isSucceeded: boolean;

  constructor(record: Record) {
    this._runnerId = record.runnerId;
    this._startedAt = record.startedAt;
    this._endedAt = record.endedAt;
    this._runningDistance = record.runningDistance;
    this._runningTime = record.runningTime;
    this._runningSpeed = record.runningSpeed;
    this._speedPerKm = record.speedPerKm;
    this._path = record.runRoute.path;
    this._startCoordinates = record.startCoordinates;
    this._endCoordinates = record.endCoordinates;
    this._isSucceeded = record.isSucceeded;
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
  get endtAt(): Date {
    return this._endedAt;
  }

  @Expose()
  get startCoordinates(): Point {
    return this._startCoordinates;
  }

  @Expose()
  get endCoordinates(): Point {
    return this._endCoordinates;
  }

  @Expose()
  get path(): LineString {
    return this._path;
  }

  @Expose()
  get isSucceeded(): boolean {
    return this._isSucceeded;
  }
}
