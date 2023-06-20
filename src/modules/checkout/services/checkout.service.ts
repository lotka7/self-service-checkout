import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import CurrencyValues from 'src/enums/CurrencyValues';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Repository } from 'typeorm';
import { Checkout } from '../interfaces/stock.interface';
import { ExchangeRateService } from './exchange.rate.service';

@Injectable()
export class CheckoutService {
  constructor(
    private myLogger: MyLogger,
    private exchangeRateService: ExchangeRateService,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {
    // Due to transient scope, StockService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('StockService');
  }

  async calculateChange(input: Checkout): Promise<{
    [key in HUFMoneyValue]?: number;
  }> {
    const { inserted, price, currency } = input;
    const insertedAmount = Object.entries(inserted).reduce(
      (total, [coin, count]) => {
        const coinValue = parseInt(coin);
        return total + coinValue * count;
      },
      0,
    );

    let insertedAmountHUF = insertedAmount;

    if (currency === CurrencyValues.EUR) {
      insertedAmountHUF = await this.exchangeRateService.getExchangeRatesAPI(
        insertedAmount,
        currency,
      );
    }
    const changeAmount = insertedAmountHUF - price;

    if (changeAmount < 0) {
      throw new HttpException('Insufficient payment.', HttpStatus.BAD_REQUEST);
    }

    const availableCoins = await this.currencyRepository.find();

    const convertedInsertedAmount: Currency[] = Object.entries(inserted).map(
      (item) =>
        this.currencyRepository.create({
          currency: currency ?? CurrencyValues.HUF,
          key: item[0],
          value: item[1],
        }),
    );

    // Use the incoming money as well to give back change
    for (const element of convertedInsertedAmount) {
      const existingIndex = availableCoins.findIndex(
        (item) => item.key === element.key && item.currency === currency,
      );
      if (existingIndex !== -1) {
        availableCoins[existingIndex].value += element.value;
      } else {
        availableCoins.push(element);
      }
    }

    const change: { [key in HUFMoneyValue]?: number } = {};
    let remainingAmount = changeAmount;

    // If the exect amount of mony was inserted
    if (remainingAmount === 0) {
      return change;
    }

    const sortedCoins = availableCoins
      .filter((c) => c.currency === CurrencyValues.HUF)
      .sort((a, b) => parseInt(b.key) - parseInt(a.key))
      .map((coin) => parseInt(coin.key));

    for (let i = 0; i < sortedCoins.length; i++) {
      const coin = sortedCoins[i];
      const coinObj = availableCoins.find((c) => parseInt(c.key) === coin);
      const countInStock = coinObj ? coinObj.value : 0;
      const count = Math.min(Math.floor(remainingAmount / coin), countInStock);

      if (count > 0) {
        change[coin] = count;
        remainingAmount -= coin * count;
      }

      if (remainingAmount === 0) {
        break;
      }
    }

    if (remainingAmount !== 0) {
      throw new HttpException(
        'Insufficient change in stock.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Get the current amount of coins after giving back the change
    const updatedCoins = Object.entries(change).reduce(
      (result, [key, count]) => {
        const foundCoinIndex = result.findIndex((coin) => coin.key === key);
        if (foundCoinIndex !== -1) {
          result[foundCoinIndex].value -= count;
        }
        return result;
      },
      [...availableCoins],
    );

    await this.currencyRepository.save(updatedCoins);

    return change;
  }
}
