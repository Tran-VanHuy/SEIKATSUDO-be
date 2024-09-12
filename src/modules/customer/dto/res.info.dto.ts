import { Type } from 'class-transformer';
import { Customer } from 'src/entities/customer.entity';

export class CustomerInfoDto {
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

  @Type(() => Date)
  birth: Date;

  @Type(() => Date)
  startDate: Date;

  @Type(() => String)
  staffId: string;

  @Type(() => String)
  staffName: string;

  @Type(() => String)
  customerRefeId: string;

  @Type(() => String)
  customerRefeName: string;

  @Type(() => Number)
  paymentPlanAmount: number;

  @Type(() => Number)
  sex: number;

  @Type(() => String)
  saleId: string;

  @Type(() => Date)
  lastShipDate: Date | String;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.birth = customer.birth;
    this.kana = customer.kana;
    this.startDate = customer.created;
    this.staffId = customer.staffcode;
    this.staffName = customer.staff?.name;
    this.customerRefeId = customer.customer_refe_id;
    this.customerRefeName = customer.customerRef?.name;
    this.sex = customer.gender;
    this.saleId = customer.sale.length > 0 ? customer.sale[0].id : '';
    this.lastShipDate = customer.sale.length > 0 ? customer.sale[0].shipping_date : '';
    this.paymentPlanAmount = customer.sale.length > 0 ? customer.sale[0].payment?.total : 0;
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
  }
}
