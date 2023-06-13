import { ValidateNested } from 'class-validator';
import {
  ValidateObjectKeysAndValues,
  validKeyValues,
} from 'src/validators/validateObjectKeysAndValues';

export class CreateStockDto {
  @ValidateNested({ each: true })
  @ValidateObjectKeysAndValues('title', {
    /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
    message: `Keys must be strings and match one of these values: ${validKeyValues} and values must be positive integers.`,
  })
  inserted: {
    [key: string]: number;
  };
}
