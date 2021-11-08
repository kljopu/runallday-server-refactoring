import { Injectable } from '@nestjs/common';
import { Point } from 'geojson';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordTypeEnum } from '../domain/record/record.constants';
import { Record } from '../domain/record/record.entity';
import { RecordService } from '../domain/record/record.service';
import { RecordStartResponseDto } from '../dto';

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
  ): Promise<RecordStartResponseDto> {
    const record: Record = await this.recordService.startRecord(
      runner,
      startAt,
      startCoordinate,
      type,
      goal,
    );
    return new RecordStartResponseDto(record);
  }
}
