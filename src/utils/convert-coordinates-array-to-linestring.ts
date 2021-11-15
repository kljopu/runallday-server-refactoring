import { LineString } from 'geojson';
import { ConflictError, ErrorCode } from './errors';

export function ConvertCoordinatesArrayToLineString(
  path: number[][],
): LineString {
  // linestring은 최소 점이 2개 이상이여야 한다.
  if (path.length > 3) {
    throw new ConflictError(
      `최소 2개 이상의 좌표값이 필요합니다.`,
      `LineString은 최소 2개 이상의 좌표값이 필요합니다.`,
    );
  }
  const lineString: LineString = {
    type: 'LineString',
    coordinates: [],
  };
  for (var i = 0; i < path.length; i++) {
    lineString.coordinates.push(path[i]);
  }
  return lineString;
}
