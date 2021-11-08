import { Body, Controller, Post } from '@nestjs/common';
import { Point } from 'geojson';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordApplicationService } from '../application/record.application.service';
import { RecordTypeEnum } from '../domain/record/record.constants';
import { RecordStartDto } from '../dto/req/record-start.dto';

@Controller('v1/record')
export class RecordV1Controller {
  constructor(private readonly recordAppService: RecordApplicationService) {}

  @Post('start')
  public async start(
    @UserDecorator() runner: Runner,
    @Body() dto: RecordStartDto,
  ): Promise<any> {
    const { startDateTime, startCoordinate, type, goal } = dto;
    //37.491242, 127.036522

    console.log(runner);
    // return await this.recordAppService.startRecord(
    //   runner,
    //   startDateTime,
    //   startCoordinate,
    //   type,
    //   goal,
    // );
  }
}
