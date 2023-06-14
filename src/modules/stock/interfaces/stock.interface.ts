import HUFMoneyValue from 'src/enums/HUFMoneyValue';

export interface Stock {
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
}
