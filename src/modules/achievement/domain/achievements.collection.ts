import { Achievement } from './achievement.entity';

export class Achievements {
  constructor(private achievements: Achievement[]) {}

  //   records: Achievement[]
  get total() {
    return this.achievements;
  }

  get title() {
    const titles: string[] = [];
    return this.achievements.map(achievement => titles.push(achievement.title));
  }
}
