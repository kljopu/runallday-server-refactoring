import * as moment from 'moment';

export function calculatePacePerDistance(
  //   startTime: Date,
  //   endTime: Date,
  seconds: number, // 소요 시간 (초)
  distance: number, // meter
) {
  //   const startAt = moment(startTime, 'YYYY-MM-DD HH:mm:DD').tz('Asia/Seoul');
  //   const endAt = moment(endTime, 'YYYY-MM-DD HH:mm:DD').tz('Asia/Seoul');
  //   const timeDiff = moment.duration(startAt.diff(endAt)).asSeconds();
  //   const calculatedPace = Math.floor(timeDiff / distance);
  const calculatedPace = Math.floor(seconds / distance);
  const paceMinutes = Math.floor(calculatedPace / 60);
  const paceSeconds = calculatedPace - paceMinutes * 60;
  const pace = `${paceMinutes}:${paceSeconds}`;
  return pace;
}
