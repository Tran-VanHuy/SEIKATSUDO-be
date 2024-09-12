import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';

export const TableName = 'received_transactions';

@Entity(TableName)
export class ReceivedTransaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  newest_sale_id: string;

  @Column()
  customer_id: string;

  @Column()
  payment_plan_id: number;

  @Column()
  payment_number: number;

  @Column()
  payment_date: Date;

  @Column()
  payment_amount: number;

  @Column()
  payment_type: string;

  @Column()
  remaining: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Sale, (sale) => sale.receives)
  @JoinColumn({ name: 'newest_sale_id' })
  sale: Sale;

  constructor(partial: Partial<ReceivedTransaction>) {
    Object.assign(this, partial);
  }
}
