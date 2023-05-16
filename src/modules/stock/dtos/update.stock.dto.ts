import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create.stock.dto';

// There are a lor of various opportunitie (like: omit, pick, partial, intersection...) to extend types
export class UpdateStockDto extends PartialType(CreateStockDto) {}
