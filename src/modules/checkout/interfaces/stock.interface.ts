import CurrencyValues from 'src/enums/CurrencyValues';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';

export interface Checkout {
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
  price: number;
  currency?: CurrencyValues;
}
