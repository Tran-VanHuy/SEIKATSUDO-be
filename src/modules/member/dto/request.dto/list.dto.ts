import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class ListMemberTransactionDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  staffCode: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  kana: string;
}
