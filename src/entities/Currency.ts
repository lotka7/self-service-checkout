import CoinValues from 'src/enums/CoinValues';
import CurrencyValues from 'src/enums/CurrencyValues';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Currency {
  @Column({ enum: CurrencyValues, default: CurrencyValues.HUF })
  currency: string;

  @PrimaryColumn({ enum: CoinValues })
  key: string;

  @Column()
  value: number;
}
