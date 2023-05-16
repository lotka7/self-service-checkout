import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorsInterceptor } from 'src/interceptors/errors.interceptor';
import { CreateStockDto } from './dtos/create.stock.dto';
import { UpdateStockDto } from './dtos/update.stock.dto';
import { IStockService } from './services/stock.service.interface';
@Controller('cats')
@UseInterceptors(ErrorsInterceptor)
export class StockController {
  constructor(
    private readonly stockService: IStockService,
    private configService: ConfigService /*<EnvironmentVariables>*/,
  ) {}

  @Post()
  async create(@Body() createStockDto: CreateStockDto) {
    // const dbHost = this.configService.get<string>('database.host');

    this.stockService.create(createStockDto);
    return 'This action adds a new Stock';
  }

  @Get(':id')
  // It can be transformad globally in main.ts trandform: true
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.stockService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return `This action removes a #${id} cat`;
  }
}
