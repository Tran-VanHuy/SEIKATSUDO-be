import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export const TableName = 'flyers';

@Entity(TableName)
export class Flyer {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  note: string;

  @Column()
  repeatflg: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  constructor(partial: Partial<Flyer>) {
    Object.assign(this, partial);
  }
}
