import { ValidationOptions, registerDecorator } from 'class-validator';
import CurrencyValues from 'src/enums/CurrencyValues';

export function ValidateCurrency(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'validCurrency',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (Object.values(CurrencyValues).includes(value)) {
            return true;
          } else {
            return false;
          }
        },
      },
    });
  };
}
