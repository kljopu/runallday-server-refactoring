import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import { Runner } from './runner.entity';

@EntityRepository(Runner)
export class RunnerRepository extends Repository<Runner> {}
