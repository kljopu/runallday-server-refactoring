import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { IsNotEmptyString, IsCoordinates } from '../../../../common/valudates';
import { RecordTypeEnum } from '../../domain/record/record.constants';

export class RecordStartDto {
  @IsNotEmptyString({ message: '올바르지 않은 시간형식입니다1.' })
  @Matches(
    /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/,
    { message: '올바르지 않은 시간 형식입니다2.' },
  )
  public startDateTime: Date;

  @IsNotEmpty({ message: '올바르지 않은 좌표입니다.' })
  @IsCoordinates({ message: '잘못된 형식입니다.' })
  public startCoordinate: string;

  @IsEnum(RecordTypeEnum, { message: '올바르지 않은 기록 타입입니다.' })
  public type: RecordTypeEnum;

  public goal?: number;
}
