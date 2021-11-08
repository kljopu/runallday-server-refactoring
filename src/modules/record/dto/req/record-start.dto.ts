import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Point } from 'geojson';
import { IsCoordinates } from '../../../../common/valudates/is-coordinates.validate';
import { RecordTypeEnum } from '../../domain/record/record.constants';

export class RecordStartDto {
  //   @IsDate()
  //   @IsNotEmpty({ message: '올바르지 않은 날짜입니다.' })
  public startDateTime?: string;

  @IsNotEmpty({ message: '올바르지 않은 좌표입니다.' })
  @IsCoordinates({ message: '잘못된 형식입니다.' })
  @Transform(point => {
    const p: Point = {
      type: 'Point',
      coordinates: [point.split(',')[0], point.split(',')[1]],
    };
    return p;
  })
  public startCoordinate: Point;

  public type: RecordTypeEnum;

  public goal?: number;
}
