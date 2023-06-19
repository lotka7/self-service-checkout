import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import {
  ValidateObjectKeysAndValues,
  validKeyValues,
} from 'src/validators/validateObjectKeysAndValues';

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
  @ValidateObjectKeysAndValues('title', {
    /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
    message: `Keys must be strings and match one of these values: ${validKeyValues} and values must be positive integers.`,
  })
  inserted: {
    [key in HUFMoneyValue]?: number;
  };
}
