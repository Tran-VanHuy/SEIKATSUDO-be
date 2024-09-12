import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  productCateId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => String(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @Transform(({ value }) => String(value))
  productText: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  productType: number;
}
