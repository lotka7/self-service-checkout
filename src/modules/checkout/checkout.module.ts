import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './services/checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, MyLogger, Currency],
  imports: [ConfigModule, TypeOrmModule.forFeature([Currency])],
})
export class CheckoutModule {}
