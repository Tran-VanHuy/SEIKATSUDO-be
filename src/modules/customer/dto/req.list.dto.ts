import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class ReqCustomerTransactionDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  id?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  name: string;
}
