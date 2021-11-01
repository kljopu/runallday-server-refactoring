import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { RecordService } from '../domain/record/record.service';

export class RecordApplicationService {
  constructor(private readonly recordService: RecordService) {}

  public async getRecordsByRunner(runner: Runner) {
    return await this.recordService.getUserRecords(runner);
  }
}
