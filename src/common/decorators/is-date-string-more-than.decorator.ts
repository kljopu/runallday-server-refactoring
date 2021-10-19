import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * @export
 * @template T
 * @param {keyof T} property
 * @param {ValidationOptions} [validationOptions]
 * @description T 타입의 property(날짜 형식의 문자열)가 현재의 값(날짜 형식의 문자열)보다 큰지 확인하는 데코레이터.
 *              날짜 형식의 문자열은 new Date(x) 에 x값을 넣었을 때 Date 인스턴스가 되는 경우를 말한다.
 */
export function IsDateStringMoreThan<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateStringMoreThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          try {
            const srcDate = new Date(relatedValue);
            const destDate = new Date(value);
            return destDate >= srcDate;
          } catch (err) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `$property date string is not more than ${property}`;
        },
      },
    });
  };
}
