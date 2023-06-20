import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/decorators/skip.auth.decorator';
import { CheckoutDto } from './dtos/checkout.dto';
import { CheckoutService } from './services/checkout.service';
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @Public()
  @HttpCode(200)
  async create(@Body() checkout: CheckoutDto) {
    return this.checkoutService.calculateChange(checkout);
  }
}
