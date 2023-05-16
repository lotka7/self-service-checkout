import { Global, Module } from '@nestjs/common';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { StockService } from './services/stock.service';
import { IStockService } from './services/stock.service.interface';
import { StockController } from './stock.controller';
@Global()
@Module({
  controllers: [StockController],
  providers: [{ provide: IStockService, useClass: StockService }, MyLogger],
})
export class StockModule {}
