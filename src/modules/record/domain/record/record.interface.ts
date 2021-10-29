import { LineString, Point } from 'geojson';

export interface IRunningDateInfo {
  totalTime: string; // 총 달린 시간. 포맷 => mm분 ss초 (※ mm이 60이 넘어갈 수 있다. 예. 100분 이용 시 100:00)
  startTime: string; // 기록 시작 시간. 포맷 => YYYY.MM.DD HH:mm:ss
  endTime: string; // 기록 종료 시간. 포맷 => YYYY.MM.DD HH:mm:ss
}

export interface IRecordInfo {
  runnerId: number; // 사용자 ID
  startedAt: Date; // 기록 시작 시간. 포맷 => YYYY.MM.DD HH:mm:ss
  endedAt: Date; // 기록 종료 시간. 포맷 => YYYY.MM.DD HH:mm:ss
  startCoordinates: Point; // 기록 시작 위치
  endCoordinates: Point; // 기록 종료 위치
  runningDistance: number; // 총 달린 거리
  runningTime: number; //총 달린 시간. 포맷 => mm분 ss초 (※ mm이 60이 넘어갈 수 있다. 예. 100분 이용 시 100:00)
  runningSpeed: number; // 스피드
  path: LineString; // 러닝 경로
}
