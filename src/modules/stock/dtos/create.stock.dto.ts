import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { ValidateObjectKeysAndValues } from 'src/validators/validateObjectKeysAndValues';

export class CreateStockDto {
  @ApiProperty({
    example: {
      inserted: {
        '2000': 1,
        '5000': 1,
      },
    },
    description: 'Inserted stock values',
  })
  @ValidateNested({ each: true })
  @ValidateObjectKeysAndValues('title')
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
}
