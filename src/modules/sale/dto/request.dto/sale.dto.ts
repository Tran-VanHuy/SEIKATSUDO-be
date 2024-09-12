import { IsNotEmpty, IsNumber, IsString, Validate, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Customer } from 'src/entities/customer.entity';
import { Member } from 'src/entities/member.entity';
import { Exist } from 'src/validator/is-exist';

export class SaleDTO {
  @IsString()
  @IsNotEmpty()
  saleId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @Validate(Exist, [Customer, 'id'])
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @Validate(Exist, [Customer, 'name'])
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @Validate(Exist, [Member, 'id'])
  staffId: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  shippingDate: Date;

  @IsNumber()
  @IsNotEmpty()
  shippingCheck: number;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  orderDate: string;

  @IsOptional()
  @Validate(IsOptional, [Member, 'id'])
  shippingConfirmStaffId: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsOptional()
  @Transform(({ value }) => String(value))
  statusChangeReason: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  shippingType: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  shippingCompanyId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  shippingCompanyName: string;

  @IsOptional()
  @Validate(IsOptional, [Member, 'id'])
  shipmentStaffId: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : ''))
  dayShipping: Date;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  paymentType: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  subTotal: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  shippingOriginId: string;
}
