import { IsString, Validate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { Customer } from 'src/entities/customer.entity';
import { Transform } from 'class-transformer';

export class PaymentPlansDto {
  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Customer, 'id'])
  customerId: string;

  @IsString()
  @IsNotEmpty()
  saleId: string;

  @IsNotEmpty()
  @IsNumber()
  paymentNumber: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  paymentDate: Date;

  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;

  @IsNotEmpty()
  @IsNumber()
  remaining: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  status: number;
}
