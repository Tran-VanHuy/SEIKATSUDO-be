import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentMethodTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  id: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  name: string;
}
