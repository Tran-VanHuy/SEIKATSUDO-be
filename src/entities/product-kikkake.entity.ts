import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

export const TableName = 'products_kikkake';

@Entity(TableName)
export class ProductKikkake {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<ProductKikkake>) {
    Object.assign(this, partial);
  }
}
