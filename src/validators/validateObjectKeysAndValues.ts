import { ValidationOptions, registerDecorator } from 'class-validator';

export function ValidateObjectKeysAndValues(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            Object.values(value).every((value) => typeof value === 'number') &&
            Object.keys(value).every((value) => typeof value === 'string')
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
