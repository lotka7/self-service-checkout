import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Repository } from 'typeorm';

@Injectable()
export class BlockedBillsService implements OnModuleInit {
  constructor(
    private myLogger: MyLogger,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {
    // Due to transient scope, BlockedBillsService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('BlockedBillsService');
  }

  // Lifecycle event
  onModuleInit() {
    this.myLogger.customLog(
      'The BlockedBillsService module has been initialized!',
    );
  }

  // TODO - try catch
  async getAcceptableDenominations(): Promise<number[]> {
    try {
      const currencies = await this.currencyRepository.find();

      const sortedStock = currencies.sort(
        (a, b) => parseInt(b.key) - parseInt(a.key),
      );

      const accaptableDenominations = [];
      const change: { [key in HUFMoneyValue]?: number } = {};

      const denominations = Object.values(HUFMoneyValue).sort(
        (a, b) => parseInt(a) - parseInt(b),
      );
      for (const [index, denomination] of denominations.entries()) {
        const smallerCurrencies = sortedStock.filter(
          (curr) => parseInt(curr.key) < parseInt(denomination),
        );

        let remainingAmount = parseInt(denomination);

        const sortedCoins = smallerCurrencies
          .sort((a, b) => parseInt(b.key) - parseInt(a.key))
          .map((coin) => parseInt(coin.key));

        if (index === 0) {
          accaptableDenominations.push(parseInt(denomination));
          continue;
        }

        for (let i = 0; i < sortedCoins.length; i++) {
          const coin = sortedCoins[i];
          const coinObj = smallerCurrencies.find(
            (c) => parseInt(c.key) === coin,
          );
          const countInStock = coinObj ? coinObj.value : 0;
          const count = Math.min(
            Math.floor(remainingAmount / coin),
            countInStock,
          );

          if (count > 0) {
            change[coin] = count;
            remainingAmount -= coin * count;
          }

          if (remainingAmount === 0) {
            accaptableDenominations.push(parseInt(denomination));
            break;
          }
        }

        if (remainingAmount !== 0) {
          continue;
        }
      }

      return accaptableDenominations;
    } catch (error) {
      throw new HttpException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
