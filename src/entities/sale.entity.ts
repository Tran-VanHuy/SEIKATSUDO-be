import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from './payment.entity';
import { Member } from './member.entity';
import { PaymentHistory } from './payment-history.entity';
import { ReceivedTransaction } from './received-transaction.entity';
import { SaleProduct } from './sale-product.entity';
import { Shipment } from './shipment.entity';
import { PaymentPlan } from './payment-plan.entity';
import { Customer } from './customer.entity';
export const TableName = 'sales';

@Entity(TableName)
export class Sale {
  @PrimaryColumn()
  id: string;

  @Column()
  customer_id: string;

  @Column()
  customer_name: string;

  @Column()
  staff_id: string;

  @Column()
  shipping_date: Date;

  @Column()
  shipping_check: number;

  @Column()
  order_date: Date;

  @Column()
  shipping_confirm_staff_id: string;

  @Column()
  shipping_company_id: string;

  @Column()
  shipping_company_name: string;

  @Column()
  status: number;

  @Column()
  status_change_reason: string;

  @Column()
  shipping_origin_id: string;

  @Column()
  shipment_staff_id: string;

  @Column()
  sub_total: number;

  @Column()
  discount: number;

  @Column()
  shipping_fee: number;

  @Column()
  shipping_type: string;

  @Column()
  total: number;

  @Column()
  day_shipping: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => SaleProduct, (product) => product.sale)
  saleProducts: SaleProduct[];

  @OneToOne(() => Payment, (payment) => payment.sale)
  payment: Payment;

  @OneToOne(() => PaymentHistory, (payment) => payment.sale)
  paymentHistories: PaymentHistory;

  @OneToMany(() => ReceivedTransaction, (received) => received.sale)
  receives: ReceivedTransaction[];

  @OneToMany(() => PaymentPlan, (received) => received.sale)
  paymentPlan: PaymentPlan[];

  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'shipping_confirm_staff_id' })
  memberConfirmStaff: Member;

  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'shipment_staff_id' })
  memberShipmentStaff: Member;

  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'staff_id' })
  staff: Member;

  @OneToOne(() => Shipment, (shipment) => shipment.sale)
  shipment: Shipment;

  @ManyToOne(() => Customer, (customer) => customer.sale)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  constructor(partial: Partial<Sale>) {
    Object.assign(this, partial);
  }
}
