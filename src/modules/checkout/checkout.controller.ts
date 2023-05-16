import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckoutDto } from './dtos/checkout.dto';
import { CheckoutService } from './services/checkout.service';
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(200)
  async create(@Body() checkout: CheckoutDto) {
    const referenceArray = this.configService.get<number[]>('denominations');
    const containsOnlyAcceptableKeys = Object.keys(checkout.inserted).every(
      (element) => referenceArray.includes(parseInt(element)),
    );
    if (!containsOnlyAcceptableKeys) {
      throw new ForbiddenException('Unaccepteable', {
        cause: new Error(),
        description: `Acceptable keys:  ${referenceArray}`,
      });
    }
    return this.checkoutService.calculateChange(checkout);
  }
}
