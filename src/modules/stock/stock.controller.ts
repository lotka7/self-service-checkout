import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateStockDto } from './dtos/create.stock.dto';
import { IStockService } from './services/stock.service.interface';
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: IStockService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }
}
