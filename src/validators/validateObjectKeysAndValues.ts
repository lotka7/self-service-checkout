import { ValidationOptions, registerDecorator } from 'class-validator';

export const validKeyValues = [
  '5',
  '10',
  '20',
  '50',
  '100',
  '200',
  '500',
  '1000',
  '2000',
  '5000',
  '10000',
  '20000',
];

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
          const validValues = Object.values(value).every((value: any) => {
            return Number.isInteger(value) && value > 0;
          });

          const validKeys = Object.keys(value).every((key) => {
            return validKeyValues.includes(key);
          });

          if (validKeys && validValues) {
            return true;
          }
          return false;
        },
      },
    });
  };
}
