import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { ReceivedTransaction } from './received-transaction.entity';
import { Sale } from './sale.entity';

export const TableName = 'payment_plans';

@Entity(TableName)
export class PaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ReceivedTransaction, (transaction) => transaction.payment_plan_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'payment_plan_id' })
  transaction: ReceivedTransaction;

  @Column()
  newest_sale_id: string;

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

  @ManyToOne(() => Sale, (sale) => sale.receives)
  @JoinColumn({ name: 'newest_sale_id' })
  sale: Sale;

  constructor(partial: Partial<PaymentPlan>) {
    Object.assign(this, partial);
  }
}
