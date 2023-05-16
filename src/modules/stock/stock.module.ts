import { Global, Module } from '@nestjs/common';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { StockService } from './services/stock.service';
import { IStockService } from './services/stock.service.interface';
import { StockController } from './stock.controller';
@Global()
// It is globally available
// it doesn't have to be imported in other modules,
// but it is not a good practice to make everything to global
@Module({
  controllers: [StockController],
  providers: [{ provide: IStockService, useClass: StockService }, MyLogger],
})
export class CatsModule {}
