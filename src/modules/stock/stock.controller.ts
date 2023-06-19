import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/skip.auth.decorator';
import { CreateStockDto } from './dtos/create.stock.dto';
import { IStockService } from './services/stock.service.interface';
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: IStockService) {}

  @Post()
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: 'The bills and coins to be loaded into the “machine” (HUF)',
  })
  @ApiOkResponse({
    description: 'Stock details',
    schema: {
      example: {
        '5': 0,
        '10': 20,
        '20': 3,
        '50': 12,
        '100': 16,
        '500': 0,
        '1000': 3,
        '2000': 2,
        '5000': 2,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CreateStockDto })
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @ApiOperation({ summary: 'Get stock details' })
  @Get()
  findAll() {
    return this.stockService.findAll();
  }
}
