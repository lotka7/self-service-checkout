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

  // TODO - check and finalize the logic
  async calculateChange(input: Checkout): Promise<{
    [key in HUFMoneyValue]?: number;
  }> {
    const { inserted, price } = input;
    const insertedAmount = this.calculateTotalAmount(inserted);
    const changeAmount = insertedAmount - price;

    console.log('changeAmount = ', insertedAmount, '-', price);
    if (changeAmount < 0) {
      throw new HttpException('Insufficient payment.', HttpStatus.BAD_REQUEST);
    }

    const availableCoins = await this.currencyRepository.find();
    console.log(availableCoins);
    let remainingAmount = changeAmount;

    const change: any = {};
    const sortedCoins = availableCoins
      .sort((a, b) => b.value - a.value)
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

    return change;
  }

  calculateTotalAmount(inserted: { [key in HUFMoneyValue]?: number }): number {
    return Object.entries(inserted).reduce((total, [coin, count]) => {
      const coinValue = parseInt(coin);
      return total + coinValue * count;
    }, 0);
  }
}
