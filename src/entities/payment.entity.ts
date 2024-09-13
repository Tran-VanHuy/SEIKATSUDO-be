import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Sale } from './sale.entity';
import { PaymentMethods } from './payment-method.entity';

export const TableName = 'payments';

@Entity(TableName)
export class Payment {
  @PrimaryGeneratedColumn()
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
  payment_type: string;

  @Column()
  payment_limit: Date;

  @Column()
  remaining: number;

  @Column()
  payment_plan_number: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToOne(() => Customer, (customer) => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToOne(() => Sale, (customer) => customer.payment)
  @JoinColumn({ name: 'newest_sale_id' })
  sale: Sale;

  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.payment)
  @JoinColumn({ name: 'payment_type' })
  paymentMethod: PaymentMethods;

  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
}
