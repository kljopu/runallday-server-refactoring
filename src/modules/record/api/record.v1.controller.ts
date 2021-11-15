import * as moment from 'moment-timezone';
import { Body, Controller, Post } from '@nestjs/common';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordApplicationService } from '../application/record.application.service';
import { convertCoordStringToPoint } from '../../../utils';
import { RecordStartDto, RecordStartResponseDto } from '../dto';

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
}
