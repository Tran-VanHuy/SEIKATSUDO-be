import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductCategoryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  type?: number;
}
