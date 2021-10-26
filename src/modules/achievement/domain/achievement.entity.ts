import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import { AchievementType } from './achievement.constants';

@Entity({ name: 't_achievement' })
export class Achievement {
  @Generated('increment')
  @PrimaryColumn({ name: 'run_route_id' })
  public id: number;

  @Column({
    nullable: false,
    comment: '메달 타이틀',
  })
  public title: string;

  @Column({
    name: 'comment',
    default: '',
  })
  public comment: string;

  @Column({
    type: 'enum',
    enum: AchievementType,
    nullable: true,
  })
  public type: AchievementType;
}
