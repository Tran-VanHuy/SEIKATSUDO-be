import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentHistory } from './payment-history.entity';

export const TableName = 'payment_methods';

@Entity(TableName)
export class PaymentMethods {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payment: Payment[];

  @OneToMany(() => PaymentHistory, (payment) => payment.paymentMethod)
  paymentHistory: PaymentHistory[];

  constructor(partial: Partial<PaymentMethods>) {
    Object.assign(this, partial);
  }
}
