import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnerRepository } from './domain/runner.repository';
import { RunnerService } from './domain/runner.service';

@Module({
  imports: [TypeOrmModule.forFeature([RunnerRepository])],
  controllers: [],
  providers: [RunnerService],
  exports: [RunnerService],
})
export class RunnerModule {}
