import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import CurrencyValues from 'src/enums/CurrencyValues';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { ValidateCurrency } from 'src/validators/validateCurrency';
import {
  ValidateObjectKeysAndValues,
  validKeyValues,
} from 'src/validators/validateObjectKeysAndValues';

export class CheckoutDto {
  @IsOptional()
  @ValidateCurrency('title', {
    message: `Currency must match one of these values: ${Object.values(
      CurrencyValues,
    )}.`,
  })
  currency?: CurrencyValues;

  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @ValidateObjectKeysAndValues('title', {
    /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
    message: `Keys must be strings and match one of these values: ${validKeyValues} and values must be positive integers.`,
  })
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
}
