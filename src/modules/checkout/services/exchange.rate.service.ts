import { Injectable } from '@nestjs/common';
import axios from 'axios';
import CurrencyValues from 'src/enums/CurrencyValues';
import { roundToNearestFive } from 'src/helpers/round.value';
import * as convert from 'xml-js';

interface ExchangeRateAPI {
  _declaration: { _attributes: { version: string; encoding: string } };
  arfolyamok: {
    valuta: object;
    deviza: { item: ExchangeRateItem };
  };
}

interface ExchangeRateItem {
  bank: { _text: string };
  datum: { _text: string };
  penznem: { _text: string };
  kozep: [{ _text: string }, { _text: string }];
}

/**
 * The napiarfolyam.hu API is an XML-based communication channel through which the exchange rates of napiarfolyam.hu can be queried.
 * The API is accessible at http://api.napiarfolyam.hu URL and can be parameterized using the GET method.
 * Without any parameters, the return value will be the current exchange rates of all banks: http://api.napiarfolyam.hu.
 */
@Injectable()
export class ExchangeRateService {
  /**
   * Get exchange rates from napiarfolyam api
   * @returns price in selected currency after calculation
   */
  async getExchangeRatesAPI(
    price: number,
    currency: CurrencyValues,
  ): Promise<number> {
    const echangeRateUrl = `http://api.napiarfolyam.hu?bank=mnb&valuta=${currency}`;
    try {
      const exchangeRateResponse = await axios.get(echangeRateUrl, {
        headers: {},
      });
      const exchangeRates: ExchangeRateAPI = JSON.parse(
        convert.xml2json(exchangeRateResponse.data, {
          compact: true,
          spaces: 4,
        }),
      );

      const exchangeRateItem: string =
        exchangeRates.arfolyamok.deviza.item.kozep[0]._text ||
        exchangeRates.arfolyamok.deviza.item.kozep[1]._text;

      if (!exchangeRateItem) {
        throw new Error('No exchange rates');
      }
      return this.exchangeRateCalculatorForHUF(price, Number(exchangeRateItem));
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * Calculate the HUF price by multiply price in selected currency and selected middle exchange rate
   * @param price Price in selected currency
   * @param middleExchangeRate Selected middle exchange rate
   * @returns Price in HUF rounded to the nearest 0 or 5
   */
  exchangeRateCalculatorForHUF(
    price: number,
    middleExchangeRate: number,
  ): number {
    const priceHUF = price * middleExchangeRate;
    return roundToNearestFive(priceHUF);
  }
}
