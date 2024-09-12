import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';
import { Unique } from 'src/validator/is-unique';

export class CreateProductKikkakeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  name: string;
}
