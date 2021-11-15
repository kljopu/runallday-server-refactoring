import { Point } from 'geojson';

/**
 * @export
 * @param {string} coordStr xx.xxxx,yyy.yyyyy 형식. 포맷 검사는 안함.
 * @returns {Point}
 * @description xx.xxxx,yyy.yyyyy 형식의 coordStr 문자열을 geojson Point 형태로 변환.
 */
export function convertCoordStringToPoint(coordStr: string): Point {
  const coorSplit = coordStr.split(',');
  const lat = Number(coorSplit[0]);
  const lon = Number(coorSplit[1]);

  return {
    type: 'Point',
    coordinates: [lon, lat],
  };
}
