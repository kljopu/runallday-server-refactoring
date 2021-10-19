import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * @export
 * @param {ValidationOptions} [validationOptions]
 * @description 0을 포함하는 양의 정수인지 확인하는 validator
 */
export function IsPositiveWithZero(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPositiveWithZero',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value >= 0) return true;
          else return false;
        },
      },
    });
  };
}
