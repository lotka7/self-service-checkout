import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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
  findAll(
    @Query('size', new DefaultValuePipe(10), ParseIntPipe)
    size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    // TODO - complete ServerSide validation
    console.log('TODO - complete ServerSide validation', page, size);
    return this.stockService.findAll();
  }
}
