import { Type } from 'class-transformer';
import { DEFAULT_PAYMENT_METHOD } from 'src/constants/constant';
import { PaymentMethods } from 'src/entities/payment-method.entity';

export class PaymentMethodDto {
  @Type(() => String)
  id: string;

  @Type(() => String)
  name: string;

  @Type(() => Boolean)
  editable: boolean;

  constructor(member: PaymentMethods) {
    this.id = member.id;
    this.name = member.name;
    this.editable = Number(member.id) > Number(DEFAULT_PAYMENT_METHOD);
  }
}
