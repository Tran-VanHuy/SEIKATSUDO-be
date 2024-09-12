import { Type } from 'class-transformer';
import { MasterCustomer } from 'src/entities/master-customer.entity';

export class settingCustomerDto {
  @Type(() => Number)
  id: number;

  @Type(() => String)
  customerCode: string;

  @Type(() => Number)
  parentId: number;

  @Type(() => String)
  childCode: string;

  @Type(() => String)
  childName: string;

  constructor(settingCustomer: MasterCustomer) {
    this.id = settingCustomer.id;
    this.customerCode = settingCustomer.customer_code;
    this.parentId = settingCustomer.parent_id;
    this.childCode = settingCustomer.child_code;
    this.childName = settingCustomer.child_name;
  }
}
