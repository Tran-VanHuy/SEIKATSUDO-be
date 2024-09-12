import { IsString, IsOptional, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class ReqProductTransactionDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  id?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  name: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  ids: string[];
}
