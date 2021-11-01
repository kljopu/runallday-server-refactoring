import { FindOneOptions } from 'typeorm';
import { Runner } from './runner.entity';
import { RunnerRepository } from './runner.repository';

export class RunnerService {
  constructor(private readonly runnerRepository: RunnerRepository) {}

  public async findOne(
    findOneOptions: FindOneOptions<Runner>,
  ): Promise<Runner> {
    const runner = await this.runnerRepository.findOne(findOneOptions);
    return runner;
  }

  public async getUserInfo(user: Runner) {
    // TODO: repository에 유저에 관련된 모든 정보 리턴 하도록 해야 함.
    // 고민해볼것: 유저 정보는 어느정도 decorator에서 가져오므로 DI를 통해 타 서비스에서 필요한 데이터 가져올지 결정 할 것.
    // const user = await this.runnerRepository.
  }
}
