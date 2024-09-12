import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class ReqSaleTransactionDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  id?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  customerName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  status: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromDateOrder: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toDateOrder: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromDateShipping: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toDateShipping: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  shippingCompanyId: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  shippingType: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  statusChangeReason: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  paymentType: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  shippingConfirmStaffId: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  shipmentStaffId: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromDayShipping: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toDayShipping: Date;
}
