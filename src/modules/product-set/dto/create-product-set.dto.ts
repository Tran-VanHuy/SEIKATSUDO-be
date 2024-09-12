import { IsDefined, ValidateNested, IsArray, IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SetProductDto } from './set-product.dto';

export class CreateProductSetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  subTotal: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  tax: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  totalSet: number;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetProductDto)
  setsProducts: SetProductDto[];
}
