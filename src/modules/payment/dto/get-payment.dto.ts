import { IsString, Validate, IsNotEmpty } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { Sale } from 'src/entities/sale.entity';
import { Customer } from 'src/entities/customer.entity';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  // @Validate(Exist, [Sale, 'id'])
  saleId: string;

  @IsString()
  @IsNotEmpty()
  // @Validate(Exist, [Customer, 'id'])
  customerId: string;
}
