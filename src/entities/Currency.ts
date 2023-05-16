import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({ default: 385 })
  value: number;
}
