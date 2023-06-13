import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { StockService } from './services/stock.service';
import { IStockService } from './services/stock.service.interface';
import { StockController } from './stock.controller';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [StockController],
  providers: [
    { provide: IStockService, useClass: StockService },
    MyLogger,
    Currency,
  ],
  exports: [{ provide: IStockService, useClass: StockService }],
})
export class StockModule {}
