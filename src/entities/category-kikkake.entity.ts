import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

export const TableName = 'categories_kikkake';

@Entity(TableName)
export class CategoryKikkake {
  @PrimaryGeneratedColumn()
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

  constructor(partial: Partial<CategoryKikkake>) {
    Object.assign(this, partial);
  }
}
