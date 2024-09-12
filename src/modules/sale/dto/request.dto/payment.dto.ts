import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  fee: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  subTotal: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  total: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  deposit: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  remaining: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  paymentPlanNumber: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  shippingFee: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : ''))
  paymentLimit: Date;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  paymentId: number;
}
