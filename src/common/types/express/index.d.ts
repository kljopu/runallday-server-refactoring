import { Runner } from '../../../modules/account/modules/runner/domain/runner.entity';

declare global {
  namespace Express {
    interface Request {
      runner?: Runner;
    }
  }
}
