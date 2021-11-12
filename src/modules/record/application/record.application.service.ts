import { Injectable } from '@nestjs/common';
import { Point } from 'geojson';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordTypeEnum } from '../domain/record/record.constants';
import { RecordService } from '../domain/record/record.service';

@Injectable()
export class RecordApplicationService {
  constructor(private readonly recordService: RecordService) {}

  public async getRecordsByRunner(runner: Runner) {
    return await this.recordService.getUserRecords(runner);
  }

  public async startRecord(
    runner: Runner,
    startAt: Date,
    startCoordinate: Point,
    type: RecordTypeEnum,
    goal?: number,
  ): Promise<any> {
    return await this.recordService.startRecord(
      runner,
      startAt,
      startCoordinate,
      type,
      goal,
    );
  }
}
