import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import CurrencyValues from 'src/enums/CurrencyValues';
import EURMoneyValue from 'src/enums/EURMoneyValue';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { CheckoutDto } from 'src/modules/checkout/dtos/checkout.dto';

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
        validate(value: any, args: ValidationArguments) {
          const validValues = Object.values(value).every((value: any) => {
            return Number.isInteger(value) && value > 0;
          });

          const validatedObject = args.object as CheckoutDto;

          let validKeys: boolean;
          if (
            validatedObject.currency &&
            validatedObject.currency === CurrencyValues.EUR
          ) {
            validKeys = Object.keys(value).every((key) =>
              Object.values(EURMoneyValue).includes(key as EURMoneyValue),
            );
          } else {
            validKeys = Object.keys(value).every((key) => {
              return Object.values(HUFMoneyValue).includes(
                key as HUFMoneyValue,
              );
            });
          }

          return validKeys && validValues;
        },
        defaultMessage(args: ValidationArguments) {
          const validatedObject = args.object as CheckoutDto;
          const responseEUR = `Keys must be strings and match one of these values: ${Object.values(
            EURMoneyValue,
          )} and values must be positive numbers.`;
          const responseHUF = `Keys must be strings and match one of these values: ${Object.values(
            HUFMoneyValue,
          )} and values must be positive integers.`;
          return validatedObject.currency &&
            validatedObject.currency === CurrencyValues.EUR
            ? responseEUR
            : responseHUF;
        },
      },
    });
  };
}
