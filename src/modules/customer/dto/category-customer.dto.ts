import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoriesCustomersDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  masterCustomerId: number;
}
