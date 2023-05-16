import { IsNumber, ValidateNested } from 'class-validator';
import { ValidateObjectKeysAndValues } from 'src/validators/validateObjectKeysAndValues';

export class CheckoutDto {
  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @ValidateObjectKeysAndValues('title', {
    /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
    message: 'Keys must be strings and values must be numbers.',
  })
  inserted: {
    [key: string]: number;
  };
}
