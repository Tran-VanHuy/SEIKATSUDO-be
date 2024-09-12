import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class DeleteProductKikkakeDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @Type(() => Number)
  ids: number[];
}
