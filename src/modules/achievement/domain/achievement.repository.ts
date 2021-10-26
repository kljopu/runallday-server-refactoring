import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Runner } from '../../account/modules/runner/domain/runner.entity';
import { Achievement } from './achievement.entity';

@Injectable()
@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  public async findOneById(achievementId: number): Promise<Achievement> {
    const achievement = await this.findOne({ id: achievementId });
    return achievement;
  }

  //TODO: application layer에서 DTO로 transform 해서 리턴해야 함.
  /**
   * @param user
   * @returns {Ahcievemnet[]}
   * @description 총 성취를 리턴
   */
  public async findByUser(user: Runner): Promise<Achievement[]> {
    const achievements: Achievement[] = await this.find({});
    return achievements;
  }
}
