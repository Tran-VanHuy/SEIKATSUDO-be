import { IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

export class ShipmentDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  deliveryDate: string;

  @IsNumber()
  @IsNotEmpty()
  deliveryTime: number;

  @IsString()
  @IsNotEmpty()
  deliveryTel: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  customerAddressId: number;

  @IsString()
  @IsNotEmpty()
  deliveryName: string;

  @IsString()
  @IsNotEmpty()
  deliveryZip: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  deliveryAddress1: string;

  @IsString()
  deliveryAddress2: string;

  @IsString()
  @IsOptional()
  deliveryAddress3: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value))
  shippingNote: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value))
  customerMemo: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  shipmentId: number;
}
