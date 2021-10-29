import * as moment from 'moment-timezone';

export function secondToTime(seconds: number): string {
  const totalTime = moment(new Date(seconds * 1000));
  const time =
    totalTime.get('y') > 1970
      ? `${totalTime.get('y') - 1970}년`
      : totalTime.get('M') >= 1
      ? `${totalTime.get('M')}개월`
      : totalTime.get('D') > 1
      ? `${totalTime.get('D') - 1}일`
      : totalTime.format('HH시간 mm분');
  return time;
}
