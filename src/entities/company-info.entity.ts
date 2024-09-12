import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const TableName = 'company_infos';

@Entity(TableName)
export class CompanyInfo {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  kana: string;

  @Column()
  executive: string;

  @Column()
  zip: string;

  @Column()
  addr1: string;

  @Column()
  addr2: string;

  @Column()
  tel: string;

  @Column()
  fax: string;

  @Column()
  account1: string;

  @Column()
  account2: number;

  @Column()
  account3: string;

  @Column()
  taxrate: number;

  @Column()
  newtaxrate: number;

  @Column()
  newtaxdate: Date;

  @Column()
  calcctrl: number;

  @Column()
  termbegin: Date;

  @Column()
  closeday: number;

  @Column()
  form: string;

  @Column()
  fracunit: number;

  @Column()
  fractype: number;

  @Column()
  fracctrl: number;

  @Column()
  taxtype: number;

  @Column()
  accountname: string;

  @Column()
  accounttel: string;

  @Column()
  days: number;

  @Column()
  bil_cust_cd: string;

  @Column()
  bil_class_cd: string;

  @Column()
  fare_no: string;

  @Column()
  payday: number;

  @Column()
  reg_discount_cnt: number;

  @Column()
  reg_discountrate: number;

  @Column()
  password01: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  constructor(partial: Partial<CompanyInfo>) {
    Object.assign(this, partial);
  }
}
