import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { Stock } from '../interfaces/stock.interface';

export abstract class IStockService {
  public abstract create(stock: Stock): void;
  public abstract findAll(): Promise<{ [key in HUFMoneyValue]?: number }>;
}
