import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Checkout } from '../interfaces/stock.interface';

@Injectable()
export class CheckoutService {
  constructor(
    private myLogger: MyLogger,
    private configService: ConfigService,
  ) {
    // Due to transient scope, StockService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('StockService');
  }

  calculateChange(checkoutObj: Checkout): { [key: string]: number } {
    const { inserted, price } = checkoutObj;
    let changeAmount = this.calculateChangeAmount(inserted, price);

    if (changeAmount < 0) {
      throw new ForbiddenException('Forbidden action', {
        cause: new Error(),
        description: 'Inserted amount of mooney is less than the price',
      });
    }

    const denominations = this.configService.get<number[]>('denominations'); // Available denominations of bills and coins

    const change = {};

    for (const denomination of denominations) {
      const quantity = Math.floor(changeAmount / denomination);
      if (quantity > 0) {
        change[denomination] = quantity;
        changeAmount -= quantity * denomination;
      }

      if (changeAmount === 0) {
        break;
      }
    }

    return change;
  }

  calculateChangeAmount(
    inserted: { [key: string]: number },
    price: number,
  ): number {
    const insertedAmount = this.calculateTotalAmount(inserted);
    return insertedAmount - price;
  }

  calculateTotalAmount(amounts: { [key: string]: number }): number {
    let totalAmount = 0;
    for (const [key, value] of Object.entries(amounts)) {
      totalAmount += parseInt(key) * value;
    }
    return totalAmount;
  }
}
