import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/entities/Currency';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { BlockedBillsController } from './blocked.billes.controller';
import { BlockedBillsService } from './blocked.bills.service';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [BlockedBillsController],
  providers: [BlockedBillsService, MyLogger, Currency],
})
export class BlockedBillsModule {}
