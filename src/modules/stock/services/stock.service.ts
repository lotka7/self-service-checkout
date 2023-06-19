import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import CurrencyValues from 'src/enums/CurrencyValues';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Repository } from 'typeorm';
import { Stock } from '../interfaces/stock.interface';
import { IStockService } from './stock.service.interface';

@Injectable()
export class StockService extends IStockService implements OnModuleInit {
  constructor(
    private myLogger: MyLogger,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {
    super();
    // Due to transient scope, StockService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('StockService');
  }

  // Lifecycle event
  onModuleInit() {
    this.myLogger.customLog('The StockService module has been initialized!');
  }

  public stocks: { [key in HUFMoneyValue]?: number } = {};

  // TODO - try catch
  async create(stock: Stock): Promise<{ [key in HUFMoneyValue]?: number }> {
    for (const [key, value] of Object.entries(stock.inserted)) {
      const existingCurrency = await this.currencyRepository.find({
        where: { key },
      });

      if (existingCurrency.length) {
        await this.currencyRepository.update(
          { key },
          { value: existingCurrency[0].value + value },
        );
      } else {
        this.currencyRepository.save({
          currency: CurrencyValues.HUF,
          key,
          value,
        });
      }
    }

    this.myLogger.customLog(`Stock has been changed!`);

    const currentCurrencies = await this.currencyRepository.find();
    const response = {};
    currentCurrencies.forEach((cur) => (response[cur.key] = cur.value));
    return response;
  }

  async findAll(): Promise<{ [key in HUFMoneyValue]?: number }> {
    const currentCurrencies = await this.currencyRepository.find();
    const response = {};
    currentCurrencies.forEach((cur) => (response[cur.key] = cur.value));
    return response;
  }
}
