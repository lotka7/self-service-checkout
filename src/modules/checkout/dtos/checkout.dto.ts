import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import CurrencyValues from 'src/enums/CurrencyValues';
import EURMoneyValue from 'src/enums/EURMoneyValue';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { ValidateCurrency } from 'src/validators/validateCurrency';
import { ValidateObjectKeysAndValues } from 'src/validators/validateObjectKeysAndValues';

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
  @ValidateObjectKeysAndValues('title')
  inserted: {
    [key in HUFMoneyValue | EURMoneyValue]?: number;
  };
}
