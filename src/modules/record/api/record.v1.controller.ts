import * as moment from 'moment-timezone';
import { Body, Controller, Post } from '@nestjs/common';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordApplicationService } from '../application/record.application.service';
import { convertCoordStringToPoint } from '../../../utils';
import { RecordEndDto, RecordStartDto, RecordStartResponseDto } from '../dto';
import { ConvertCoordinatesArrayToLineString } from '../../../utils/convert-coordinates-array-to-linestring';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

@Controller('v1/record')
export class RecordV1Controller {
  constructor(private readonly recordAppService: RecordApplicationService) {}

  @Post('start')
  public async start(
    @UserDecorator() runner: Runner,
    @Body() dto: RecordStartDto,
  ): Promise<RecordStartResponseDto> {
    const { startDateTime, type, goal } = dto;
    const startCoordinateStr = dto.startCoordinate;
    const startAt = new Date(
      moment(startDateTime, 'YYYY-MM-DD HH:mm:DD')
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD HH:mm:DD'),
    );
    const startCoordinate = convertCoordStringToPoint(startCoordinateStr);

    return await this.recordAppService.startRecord(
      runner,
      startAt,
      startCoordinate,
      type,
      goal,
    );
  }

  @Post('end')
  @Transaction()
  public async end(
    @UserDecorator() runner: Runner,
    @TransactionManager() entityManager: EntityManager,
    @Body() dto: RecordEndDto,
  ): Promise<any> {
    const { recordUid, endDateTime, speedPerKm, isSucceeded } = dto;
    const endCoordinatesStr = dto.endCoordinates;
    const pathArr = dto.path;
    const endCoordinates = convertCoordStringToPoint(endCoordinatesStr);
    const path = ConvertCoordinatesArrayToLineString(pathArr);
    const endAt = new Date(
      moment(endDateTime, 'YYYY-MM-DD HH:mm:DD')
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD HH:mm:DD'),
    );
    return await this.recordAppService.endRecord(
      entityManager,
      runner,
      recordUid,
      endCoordinates,
      endAt,
      path,
      speedPerKm,
      isSucceeded,
    );
  }
}
