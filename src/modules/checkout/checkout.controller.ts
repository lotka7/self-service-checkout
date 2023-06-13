import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
    return this.checkoutService.calculateChange(checkout);
  }
}
