import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
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
    [key: string]: number;
  }> {
    const { inserted, price } = input;
    const insertedAmount = this.calculateTotalAmount(inserted);
    const changeAmount = insertedAmount - price;

    console.log('changeAmount = ', insertedAmount, '-', price);
    if (changeAmount < 0) {
      console.log('Error: Insufficient payment.');
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
      console.log('Error: Insufficient change in stock.');
    }

    return change;
  }

  calculateTotalAmount(inserted: { [key: string]: number }): number {
    return Object.entries(inserted).reduce((total, [coin, count]) => {
      const coinValue = parseInt(coin);
      return total + coinValue * count;
    }, 0);
  }

  //   calculateChange(checkoutObj: Checkout): { [key: string]: number } {
  //     const { inserted, price } = checkoutObj;
  //     let changeAmount = this.calculateChangeAmount(inserted, price);
  //     // const change2 =
  //     //   Object.entries(inserted).reduce(
  //     //     (acc, curr) => (acc += parseFloat(curr[0]) * curr[1]),
  //     //     0,
  //     //   ) - price;

  //     if (changeAmount < 0) {
  //       throw new BadRequestException('Forbidden action', {
  //         cause: new Error(),
  //         description: 'Inserted amount of mooney is less than the price',
  //       });
  //     }

  //     const denominations = this.configService.get<number[]>('denominations'); // Available denominations of bills and coins

  //     const change = {};

  //     for (const denomination of denominations) {
  //       const quantity = Math.floor(changeAmount / denomination);
  //       if (quantity > 0) {
  //         change[denomination] = quantity;
  //         changeAmount -= quantity * denomination;
  //       }

  //       if (changeAmount === 0) {
  //         break;
  //       }
  //     }

  //     return change;
  //   }

  //   calculateChangeAmount(
  //     inserted: { [key: string]: number },
  //     price: number,
  //   ): number {
  //     const insertedAmount = this.calculateTotalAmount(inserted);
  //     return insertedAmount - price;
  //   }

  //   calculateTotalAmount(amounts: { [key: string]: number }): number {
  //     let totalAmount = 0;
  //     for (const [key, value] of Object.entries(amounts)) {
  //       totalAmount += parseInt(key) * value;
  //     }
  //     return totalAmount;
  //   }
}
