import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Point } from 'geojson';

export function IsCoordinates(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsCoordinates',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: Point, args: ValidationArguments) {
          const coord = value.coordinates;
          if (coord.length !== 2) {
            return false;
          }

          const lat = Number(coord[0]);
          const lon = Number(coord[1]);
          if (lat === Number.NaN || lon === Number.NaN) {
            return false;
          }

          if (-90 > lat || lat > 90) {
            return false;
          }
          if (-180 > lon || lon > 180) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `value is not bbox type`;
        },
      },
    });
  };
}
