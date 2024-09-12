import { IsPositive, IsNotEmpty, IsNumber, IsString, Validate, IsEnum, MaxDate, IsDate } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { Type } from 'class-transformer';
import { Sale } from 'src/entities/sale.entity';
import { Customer } from 'src/entities/customer.entity';
import { PaymentPlan } from 'src/entities/payment-plan.entity';

export class CreateReceivedTransaction {
  @IsDate()
  @Type(() => Date)
  paymentDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  paymentAmount: number;

  @IsString()
  @Type(() => String)
  paymentType: string;

  @IsNumber()
  @Validate(Exist, [PaymentPlan, 'id'])
  paymentPlanId: number;

  @IsNumber()
  @IsNotEmpty()
  paymentNumber: number;

  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Sale, 'id'])
  saleId: string;

  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Customer, 'id'])
  customerId: string;

  @IsNumber()
  @IsNotEmpty()
  remaining: number;
}
