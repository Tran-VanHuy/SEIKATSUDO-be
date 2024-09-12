import { Type } from 'class-transformer';
import { Customer } from 'src/entities/customer.entity';

export class CustomerDto {
  @Type(() => String)
  id: string;

  @Type(() => String)
  name: string;

  @Type(() => String)
  kana: string;

  @Type(() => String)
  zip1: string;

  @Type(() => String)
  addr11: string;

  @Type(() => String)
  addr12: string;

  @Type(() => String)
  addr13: string;

  @Type(() => String)
  telNo1: string;

  @Type(() => String)
  zip2: string;

  @Type(() => String)
  addr21: string;

  @Type(() => String)
  addr22: string;

  @Type(() => String)
  addr23: string;

  @Type(() => String)
  telNo2: string;

  @Type(() => String)
  zip3: string;

  @Type(() => String)
  addr31: string;

  @Type(() => String)
  addr32: string;

  @Type(() => String)
  addr33: string;

  @Type(() => String)
  telNo3: string;

  @Type(() => String)
  areaCode: string;

  @Type(() => Boolean)
  check: boolean;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.zip1 = customer.zip1;
    this.telNo1 = customer.telno1;
    this.addr11 = customer.addr11;
    this.addr12 = customer.addr12;
    this.addr13 = customer.addr13;
    this.zip2 = customer.zip2;
    this.telNo2 = customer.telno2;
    this.addr21 = customer.addr21;
    this.addr22 = customer.addr22;
    this.addr23 = customer.addr23;
    this.zip3 = customer.zip3;
    this.telNo3 = customer.telno3;
    this.addr31 = customer.addr31;
    this.addr32 = customer.addr32;
    this.addr33 = customer.addr33;
    this.check = false;
  }
}
