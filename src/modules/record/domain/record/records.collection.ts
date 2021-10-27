import { Record } from './record.entity';
import { IRecordInfo } from './record.interface';

export class Records {
  constructor(private records: Record[]) {}

  get list() {
    // TODO intecface
    const records: IRecordInfo[] = [];
    this.records.map(rc => {
      const record: IRecordInfo = <IRecordInfo>{
        runnerId: rc.runnerId,
        startedAt: rc.startedAt,
        endedAt: rc.endedAt,
        startCoordinates: rc.startCoordinates,
        endCoordinates: rc.endCoordinates,
        runningDistance: rc.runningDistance,
        runningTime: rc.runningTime,
        runningSpeed: rc.runningSpeed,
        path: rc.runRoute.path, // 경로 값 리턴하게 추가 해야 함.
      };
      records.push(record);
    });
    return records;
  }
}
