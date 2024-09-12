import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SetProductDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}
