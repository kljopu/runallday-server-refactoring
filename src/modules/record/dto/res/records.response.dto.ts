import { LineString, Point } from 'geojson';

export class RecordsResponseDto {
  private _runnerId: number;
  private _startedAt: Date;
  private _endedAt: Date;
  private _startCoordinates: Point;
  private _endCoordinates: Point;
  private _runningDistance: number;
  private _runningTime: number;
  private _runningSpeed: number;
  private _path: LineString;

  constructor() {}
}
