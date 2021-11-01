import { InternalServerErrorException } from '@nestjs/common';
import { meterToKillometer, secondToTime } from '../../../../utils';
import { ConflictError } from '../../../../utils/errors';
import { Record } from './record.entity';
import { IRecordInfo } from './record.interface';

export class Records {
  constructor(private records: Record[]) {
    // Records Collection을 사용하기 위해서는 기록이 한개 이상 존재해야 한다.
    // Collection을 가져오기 전에 미리 Empty한지 확인 -> 다른 로직으로 진행.
    if (records.length === 0) {
      throw new ConflictError('기록은 한개 이상 존재해야 합니다.');
    }
  }

  private recordInfo: IRecordInfo[];
  private totalDistance: number;
  private totalTime: number;
  private topPace: number;
  private avgPace: number;

  get list() {
    this.records.forEach(rc => {
      const record: IRecordInfo = <IRecordInfo>{
        runnerId: rc.runnerId,
        runnerName: rc.runner.getFullname(),
        startedAt: rc.startedAt,
        endedAt: rc.endedAt,
        startCoordinates: rc.startCoordinates,
        endCoordinates: rc.endCoordinates,
        runningDistance: rc.runningDistance,
        runningTime: rc.runningTime,
        runningSpeed: rc.runningSpeed,
        path: rc.runRoute.path,
      };
      this.recordInfo.push(record);
    });
    this.totalDistance = this.calculatetTotalDistance();
    this.totalTime = this.calculateTotalTime();
    this.topPace = this.getTopPace();
    this.avgPace = this.getAveragePace();
    return this;
  }

  public getTopPace(): number {
    var speedArr: number[];
    this.records.forEach(record => {
      speedArr.push(record.runningSpeed);
    });
    return Math.max(...speedArr);
  }

  private getAveragePace(): number {
    // user에서 가져 올 것인지 계산을 따로 할 것인지 결정 해야 함.
    // User 객체에 totalDistance와 totalTime을 따로 적립 적립할 건지.
    const totalDistance = this.calculatetTotalDistance();
    const totalTime = this.calculateTotalTime();
    const avgPace = this.calculatePace(totalDistance, totalTime);
    return avgPace;
  }

  private calculatetTotalDistance(): number {
    const totalDistance = this.records
      .map(record => record.runningDistance)
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    return totalDistance;
  }

  private calculateTotalTime(): number {
    const totalTime = this.records
      .map(record => record.runningTime)
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    return totalTime;
  }

  /**
   * @param totalDist 이동 거리 (meter)
   * @param totalTime 시간 (sec)
   * @returns {pace} 초단위의 페이스. Response에서 분/초로 변환
   * @description 거리와 시간을 입력받아 pace(초)를 계산하는 메서드
   */
  private calculatePace(dist: number, time: number): number {
    var calculatedPace = Math.floor(time / dist);
    // var pace;
    //console.log(calculatedPace);
    // var paceMins = Math.floor(calculatedPace / 60);
    // var paceSecs = calculatedPace - paceMins * 60;
    // pace = `${paceMins}:${paceSecs}`;
    // return pace;
    return calculatedPace;
  }
}
