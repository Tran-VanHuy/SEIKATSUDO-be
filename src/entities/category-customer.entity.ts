import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { MasterCustomer } from './master-customer.entity';

export const TableName = 'category_customer';

@Entity(TableName)
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  customer_id: string;

  @Column()
  master_customer_id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => MasterCustomer, (masterCustomer) => masterCustomer.categoryCustomer)
  @JoinColumn({ name: 'master_customer_id' })
  masterCustomer: MasterCustomer;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
