import CurrencyValues from 'src/enums/CurrencyValues';
import HUFMoneyValue from 'src/enums/HUFMoneyValue';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Currency {
  @Column({ enum: CurrencyValues, default: CurrencyValues.HUF })
  currency: string;

  @PrimaryColumn({ enum: HUFMoneyValue })
  key: string;

  @Column()
  value: number;
}
