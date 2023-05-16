import { IsNumber, ValidateNested } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  inserted: {
    [key: string]: number;
  };

  // @IsNumber()
  // price: number;
}
