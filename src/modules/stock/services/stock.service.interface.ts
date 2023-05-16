import { Stock } from '../interfaces/stock.interface';

export abstract class IStockService {
  public abstract create(stock: Stock): void;
  public abstract findAll(): Stock[];
  public abstract findOne(id: number): Stock;
  public abstract delete(id: number): void;
}
