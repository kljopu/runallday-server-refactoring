import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import {
  IsArrayOfCoordinates,
  IsCoordinates,
  IsNotEmptyArray,
  IsNotEmptyString,
} from '../../../../common/valudates';
import { RecordTypeEnum } from '../../domain/record/record.constants';

export class RecordEndDto {
  @IsDefined({ message: '종료할 기록을 확인해주세요' })
  @IsString({ message: '잘못된 좌표값입니다.' })
  public recordUid: string;

  @IsNotEmpty({ message: '잘못된 좌표값입니다.' })
  @IsString({ message: '잘못된 좌표값입니다.' })
  @IsCoordinates({ message: '잘못된 좌표값입니다.' })
  public endCoordinates: string;

  @IsNotEmptyString({ message: '올바르지 않은 시간형식입니다1.' })
  @Matches(
    /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/,
    { message: '올바르지 않은 시간 형식입니다2.' },
  )
  public endDateTime: Date;

  @IsArray({ message: '잘못된 값입니다.' })
  @IsArrayOfCoordinates({ message: '잘못된 좌표값입니다.' })
  @Transform((val: string[][]) => {
    return val.map(val => val.map(str => Number(str)));
  })
  public path: number[][];

  @IsArray({ message: '잘못된 값입니다.' })
  @IsNotEmptyArray({ message: '잘못된 값입니다.' })
  public speedPerKm: number[];

  @IsNotEmpty({ message: '잘못된 값입니다.' })
  @IsNumber({}, { message: '잘못된 값입니다.' })
  public runningDistance: number;

  // 사람은 평균 한시간에 5km를 간다
  // 그렇다면 1키로당 소요시간은 평균 720초(12분)이다
  // 여기에 여유분 1.5배를 하여 1080초(18분)안에 1km를 주파하지 못한다면
  // 서버에 문제가 있던지 기록 종료를 하지 않은 것으로 판단한다.
  // 즉, 총 거리 * 시간(1080초)보다 넘는 시간이라면 기록 종료로 저장을 하되
  // 문제가 있음을 알리는 것이 맞다
  // 이는 이후 내부 로직을 통해 알림 형식으로 구현하자 (일정 기간 멈춤, 일정 시간 소요)
  @IsNotEmpty({ message: '잘못된 값입니다.' })
  @IsNumber({}, { message: '잘못된 값입니다.' })
  public runningTime: number; // 초단위

  // 스피드는 분.초의 형식으로 구성된다.
  // 이 둘을 분리해 분, 초의 형식이 맞는지 검증하는 Custom Validator가 필요하다.
  // 서버에서 산출하는 것으로 결정
  // @IsNotEmpty({ message: '잘못된 값입니다.' })
  // @IsNumber({}, { message: '잘못된 값입니다.' })
  // public runningSpeed: number;

  @IsNotEmpty({ message: '잘못된 좌표값입니다.' })
  @IsBoolean({ message: '잘못된 값입니다.' })
  public isSucceeded: boolean;

  @IsNotEmpty({ message: '잘못된 값입니다.' })
  @IsEnum(RecordTypeEnum, { message: '잘못된 기록 타입입니다.' })
  public recordType: RecordTypeEnum;

  @IsOptional()
  @Transform(val => Number(val))
  @IsNumber(undefined, { message: '잘못된 값입니다.' })
  @IsPositive({ message: '잘못된 값입니다.' })
  public goal?: number;
}
