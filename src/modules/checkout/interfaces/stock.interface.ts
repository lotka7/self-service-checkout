import HUFMoneyValue from 'src/enums/HUFMoneyValue';

export interface Checkout {
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
  price: number;
}
