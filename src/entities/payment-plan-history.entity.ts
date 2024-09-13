import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ReceivedTransaction } from './received-transaction.entity';

export const TableName = 'payment_plan_histories';

@Entity(TableName)
export class PaymentPlanHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  newest_sale_id: string;

  @OneToOne(() => ReceivedTransaction, (transaction) => transaction.newest_sale_id)
  @JoinColumn({ name: 'newest_sale_id', referencedColumnName: 'newest_sale_id' })
  transaction: ReceivedTransaction;

  @Column()
  customer_id: string;

  @Column()
  payment_number: number;

  @Column()
  payment_date: Date;

  @Column()
  payment_amount: number;

  @Column()
  remaining: number;

  @Column()
  status: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<PaymentPlanHistory>) {
    Object.assign(this, partial);
  }
}
