import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsArrayOfCoordinates(validationOptions?: ValidationOptions) {
  const isCoordinates = function(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const coord = value.split(',');
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
  };
  return function(object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfCoordinates',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: number[][], args: ValidationArguments): boolean {
          if (value.length === 0) {
            return false;
          }
          for (var i = 0; i < value.length; i++) {
            if (value[i].length !== 2 || value[i].length > 2) {
              return false;
            }
            const coordinates = `${value[i][0]},${value[i][1]}`;
            if (isCoordinates(coordinates) === false) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `value is not LineString type`;
        },
      },
    });
  };
}
