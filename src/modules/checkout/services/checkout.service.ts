import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Repository } from 'typeorm';
import { Checkout } from '../interfaces/stock.interface';

@Injectable()
export class CheckoutService {
  constructor(
    private myLogger: MyLogger,
    private configService: ConfigService,
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
    const { inserted, price } = input;
    const insertedAmount = Object.entries(inserted).reduce(
      (total, [coin, count]) => {
        const coinValue = parseInt(coin);
        return total + coinValue * count;
      },
      0,
    );

    const changeAmount = insertedAmount - price;

    if (changeAmount < 0) {
      throw new HttpException('Insufficient payment.', HttpStatus.BAD_REQUEST);
    }

    const covertedInsertedAmount: Currency[] = Object.entries(inserted).map(
      (item) =>
        this.currencyRepository.create({
          currency: 'HUF',
          key: item[0],
          value: item[1],
        }),
    );

    const availableCoins = await this.currencyRepository.find();

    // Use the incoming money as well to give back change
    for (const element of covertedInsertedAmount) {
      const existingIndex = availableCoins.findIndex(
        (item) => item.key === element.key,
      );
      if (existingIndex !== -1) {
        availableCoins[existingIndex].value += element.value;
      } else {
        availableCoins.push(element);
      }
    }

    const change: { [key in HUFMoneyValue]?: number } = {};
    console.log(availableCoins);
    let remainingAmount = changeAmount;

    // If the exect amount of mony was inserted
    if (remainingAmount === 0) {
      return change;
    }

    const sortedCoins = availableCoins
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
