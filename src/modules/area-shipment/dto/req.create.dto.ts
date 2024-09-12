import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReqAreaShipmentTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  code: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  area: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  shipmentDay: number;
}
