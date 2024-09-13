import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export const TableName = 'area_shipments';

@Entity(TableName)
export class AreaShipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  area_id: number;

  @Column()
  name: string;

  @Column()
  days: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  constructor(partial: Partial<AreaShipment>) {
    Object.assign(this, partial);
  }
}
