import { IsString, Validate, IsNotEmpty, IsOptional } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { Customer } from 'src/entities/customer.entity';

export class GetSaleByCustomerSaleDto {
  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Customer, 'id'])
  customerId: string;

  @IsString()
  @IsOptional()
  saleId: string;
}

export class GetPaymentPlansByCustomerSaleDto extends GetSaleByCustomerSaleDto {}

export class GetPaymentByCustomerSaleDto extends GetSaleByCustomerSaleDto {}
