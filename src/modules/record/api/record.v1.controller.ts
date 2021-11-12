import * as moment from 'moment-timezone';
import { Body, Controller, Post } from '@nestjs/common';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordApplicationService } from '../application/record.application.service';
import { RecordStartDto } from '../dto/req/record-start.dto';

@Controller('v1/record')
export class RecordV1Controller {
  constructor(private readonly recordAppService: RecordApplicationService) {}

  @Post('start')
  public async start(
    @UserDecorator() runner: Runner,
    @Body() dto: RecordStartDto,
  ): Promise<any> {
    const { startDateTime, type, goal, startCoordinate } = dto;
    const startAt = new Date(
      moment(startDateTime, 'YYYY-MM-DD HH:mm:DD')
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD HH:mm:DD'),
    );
    // Transform decorator로 안되니 util 함수를 통해 string -> Point로 변경해줘야 겠음.

    return await this.recordAppService.startRecord(
      runner,
      startAt,
      startCoordinate,
      type,
      goal,
    );
  }
}
