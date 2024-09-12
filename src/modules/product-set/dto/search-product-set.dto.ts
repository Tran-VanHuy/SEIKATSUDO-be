import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class SearchProductSetDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name: string;
}
