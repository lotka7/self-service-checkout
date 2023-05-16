import { Injectable, OnModuleInit } from '@nestjs/common';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Stock } from '../interfaces/stock.interface';
import { IStockService } from './stock.service.interface';

@Injectable()
export class StockService extends IStockService implements OnModuleInit {
  constructor(private myLogger: MyLogger) {
    super();
    // Due to transient scope, StockService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('StockService');
  }

  // Example for Lifecycle event
  onModuleInit() {
    this.myLogger.customLog('The StockService module has been initialized!');
  }

  private stocks: Stock[] = [];

  create(stock: Stock) {
    this.stocks.push(stock);
    this.myLogger.customLog('Stck has been created!');
  }

  findAll(): Stock[] {
    console.log(this.stocks);
    return this.stocks;
  }

  findOne(id: number): Stock {
    return this.stocks.find((stock) => stock.id === id);
  }

  delete(id: number) {
    this.stocks = this.stocks.filter((stock) => stock.id !== id);
  }
}
