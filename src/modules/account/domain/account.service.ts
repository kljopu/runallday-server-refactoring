import { Inject, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { Runner } from '../modules/runner/domain/runner.entity';
import { RunnerService } from '../modules/runner/domain/runner.service';
import { UserGenderEnum } from './account.constants';

@Injectable()
export class AccountService {
  constructor(private readonly runnerService: RunnerService) {}

  /**
   * @param findOneOptions
   * @returns {Runner}
   * @description Default findOne 메서드
   */
  public async findOne(findOneOptions: FindOneOptions<Runner>) {
    return await this.runnerService.findOne(findOneOptions);
  }

  public async findOneByEmail(email: string) {
    return await this.runnerService.findOne({ where: { email } });
  }

  public async register(
    native: boolean,
    name: string,
    gender: UserGenderEnum,
    birthday: Date,
    email: string,
    phoneNumber: string,
    password: string,
    di: string,
    now: Date,
  ): Promise<Runner> {
    // 객체 생성
    const newRunner: Runner = new Runner();
    await newRunner.register(
      native,
      name,
      gender,
      birthday,
      email,
      phoneNumber,
      password,
      di,
      now,
    );
    return newRunner;
  }
}
