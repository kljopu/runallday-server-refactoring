export interface RunningDateInfo {
  totalTime: string; // 사용한 시간. 포맷 => mm분 ss초 (※ mm이 60이 넘어갈 수 있다. 예. 100분 이용 시 100:00)
  startTime: string; // 대여 시작 시간. 포맷 => YYYY.MM.DD HH:mm:ss
  endTime: string; // 반납 시간. 포맷 => YYYY.MM.DD HH:mm:ss
}
