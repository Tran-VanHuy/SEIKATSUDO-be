import { IsNotEmpty, IsString, Validate, MaxLength } from 'class-validator';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { Unique } from 'src/validator/is-unique';

export class CreateCategoryKikkakeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  name: string;
}
