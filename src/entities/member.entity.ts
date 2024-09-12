import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

export const TableName = 'members';

@Entity(TableName)
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  staffcode: string;

  @Column()
  kana: string;

  @Column()
  email: string;

  @Column()
  note: string;

  @Column()
  startdate: Date;

  @Column()
  disabled: number;

  @Column()
  password: string;

  @Column()
  authority: number;

  @Column()
  branchcode: string;

  @Column()
  teamcode: string;

  @Column()
  enddate: Date;

  @Column()
  reset_password_token: string;

  @Column()
  token_expiration: Date;

  @Column()
  used_token: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => Customer, (customer) => customer.staffcode)
  @JoinColumn({ name: 'staffcode', referencedColumnName: 'staffcode' })
  staff: Customer;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}
