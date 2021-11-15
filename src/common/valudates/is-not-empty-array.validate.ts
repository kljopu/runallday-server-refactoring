import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: []): boolean => value.length !== 0,
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} should not be an empty array`,
      },
    });
  };
}
