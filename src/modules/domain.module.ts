import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { RunnerModule } from './account/modules/runner/runner.module';
import { RecordModule } from './record/record.module';

@Module({
  imports: [RunnerModule, AccountModule, RecordModule],
  controllers: [],
  providers: [AccountModule, RunnerModule],
  exports: [],
})
export class DomainModule {}
