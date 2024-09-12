import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Sale } from './sale.entity';
import { PaymentMethods } from './payment-method.entity';

export const TableName = 'payment_histories';

@Entity(TableName)
export class PaymentHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  newest_sale_id: string;

  @Column()
  customer_id: string;

  @Column()
  sub_total: number;

  @Column()
  fee: number;

  @Column()
  total: number;

  @Column()
  deposit: number;

  @Column()
  remaining: number;

  @Column()
  payment_plan_number: number;

  @Column()
  payment_type: string;

  @CreateDateColumn()
  payment_limit: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToOne(() => Sale, (sale) => sale.payment)
  @JoinColumn({ name: 'newest_sale_id' })
  sale: Sale;

  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.payment)
  @JoinColumn({ name: 'payment_type' })
  paymentMethod: PaymentMethods;

  constructor(partial: Partial<PaymentHistory>) {
    Object.assign(this, partial);
  }
}
