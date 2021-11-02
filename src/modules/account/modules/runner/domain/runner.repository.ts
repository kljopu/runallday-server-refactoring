import { Injectable } from '@nestjs/common';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import { Runner } from './runner.entity';

@Injectable()
@EntityRepository(Runner)
export class RunnerRepository extends Repository<Runner> {}
