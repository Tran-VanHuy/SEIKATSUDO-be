import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

export const TableName = 'change_types';

@Entity(TableName)
export class ChangeType {
  @PrimaryColumn()
  tabletype: number;

  @PrimaryColumn()
  lcode: string;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  constructor(partial: Partial<ChangeType>) {
    Object.assign(this, partial);
  }
}
