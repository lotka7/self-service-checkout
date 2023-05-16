import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './services/checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, MyLogger],
  imports: [ConfigModule],
})
export class CheckoutModule {}
