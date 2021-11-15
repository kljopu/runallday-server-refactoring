import { EntityRepository, Repository } from 'typeorm';
import { RunRoute } from './run-route.entity';

@EntityRepository(RunRoute)
export class RunRouteRepository extends Repository<RunRoute> {}
