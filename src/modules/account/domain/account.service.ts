import { Inject } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { Runner } from '../modules/runner/domain/runner.entity';
import { RunnerService } from '../modules/runner/domain/runner.service';

export class AccountService {
  constructor(private readonly runnerService: RunnerService) {}

  public async findOne(findOneOptions: FindOneOptions<Runner>) {
    return await this.runnerService.findOne(findOneOptions);
  }
}
