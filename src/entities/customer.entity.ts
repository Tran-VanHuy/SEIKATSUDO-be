import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Member } from './member.entity';

export const TableName = 'customers';

@Entity(TableName)
export class Customer {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  kana: string;

  @Column()
  publish: Date;

  @Column()
  zip1: string;

  @Column()
  addr11: string;

  @Column()
  addr12: string;

  @Column()
  addr13: string;

  @Column()
  telno1: string;

  @Column()
  zip2: string;

  @Column()
  addr21: string;

  @Column()
  addr22: string;

  @Column()
  addr23: string;

  @Column()
  telno2: string;

  @Column()
  zip3: string;

  @Column()
  addr31: string;

  @Column()
  addr32: string;

  @Column()
  addr33: string;

  @Column()
  telno3: string;

  @Column()
  birth: Date;

  @Column()
  gender: number;

  @Column()
  staffcode: string;

  @Column()
  note1: string;

  @Column()
  note2: string;

  @Column()
  disabled: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  attention: string;

  @Column()
  parents_code: string;

  @Column()
  email: string;

  @Column()
  imode: string;

  @Column()
  dissend_dm: number;

  @Column()
  dissend_tel: number;

  @Column()
  category: string;

  @Column()
  product: string;

  @Column()
  update_customer: Date;

  @Column()
  customer_refe_id: string;

  @Column()
  shipping_date: Date;

  @Column()
  my_self_talk: boolean;

  @Column()
  my_wife_talk: boolean;

  @Column()
  other_talk: boolean;

  @Column()
  text_other_talk: string;

  @Column()
  my_self_drink: boolean;

  @Column()
  my_wife_drink: boolean;

  @Column()
  other_drink: boolean;

  @Column()
  text_other_drink: string;

  @Column()
  legs_hips: boolean;

  @Column()
  blood_ressure: boolean;

  @Column()
  pedigree: boolean;

  @Column()
  insomnia: boolean;

  @Column()
  other_symptoms: boolean;

  @Column()
  other_symptoms_text: string;

  @Column()
  medicines_foods_text: string;

  @Column()
  job: string;

  @Column()
  assigned_person: boolean;

  @Column()
  son: boolean;

  @Column()
  daughter: boolean;

  @Column()
  wife: boolean;

  @Column()
  father: boolean;

  @Column()
  mother: boolean;

  @Column()
  etc: boolean;

  @Column()
  total: string;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sale: Sale[];

  @ManyToOne(() => Member, (member) => member.staffcode)
  @JoinColumn({ name: 'staffcode', referencedColumnName: 'staffcode' })
  staff: Member;

  @ManyToOne(() => Customer, (customer) => customer.id)
  @JoinColumn({ name: 'customer_refe_id' })
  customerRef: Customer;

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}
