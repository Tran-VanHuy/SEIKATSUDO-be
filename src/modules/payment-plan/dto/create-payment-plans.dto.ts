import { IsString, Validate, IsNotEmpty, ValidateNested } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { Customer } from 'src/entities/customer.entity';
import { Type } from 'class-transformer';
import { PaymentPlansDto } from './payment-plans.dto';

export class CreatePaymentPlans {
  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Customer, 'id'])
  customerId: string;

  @ValidateNested({ each: true })
  @Type(() => PaymentPlansDto)
  paymentPlans: PaymentPlansDto[];
}
