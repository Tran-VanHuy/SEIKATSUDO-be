import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export const TableName = 'holidays';

@Entity(TableName)
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  month_day: string;

  @Column()
  fulldate: Date;

  @Column()
  name: string;

  @CreateDateColumn()
  created: string;

  @UpdateDateColumn()
  updated: Date;

  constructor(partial: Partial<Holiday>) {
    Object.assign(this, partial);
  }
}
