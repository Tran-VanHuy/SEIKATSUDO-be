import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  sort: number;

  @IsNumber()
  @IsNotEmpty()
  type: number;

  unit: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  subTax: number;
}
