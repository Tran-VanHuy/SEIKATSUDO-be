import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, DeleteDateColumn } from 'typeorm';

export const TableName = 'shipping_companies';

@Entity(TableName)
export class ShippingCompany {
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

  constructor(partial: Partial<ShippingCompany>) {
    Object.assign(this, partial);
  }
}
