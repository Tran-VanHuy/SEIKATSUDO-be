import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class ReqProductCategoryDto extends PaginationDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  productType: number;
}
