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
import { Category } from './category-customer.entity';

export const TableName = 'master_customers';

@Entity(TableName)
export class MasterCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_code: string;

  @Column()
  parent_id: number;

  @Column()
  child_code: string;

  @Column()
  child_name: string;

  @Column()
  is_update: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Category, (categoryCustomer) => categoryCustomer.masterCustomer)
  categoryCustomer: Category[];

  constructor(partial: Partial<MasterCustomer>) {
    Object.assign(this, partial);
  }
}
