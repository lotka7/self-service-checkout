import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CheckoutDto } from './dtos/checkout.dto';
import { CheckoutService } from './services/checkout.service';
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @HttpCode(200)
  // TODO - implement EUR solution in pipes
  async create(@Body() checkout: CheckoutDto) {
    return this.checkoutService.calculateChange(checkout);
  }
}
