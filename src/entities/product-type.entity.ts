import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

export const TableName = 'product_types';

@Entity(TableName)
export class ProductTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<ProductTypes>) {
    Object.assign(this, partial);
  }
}
