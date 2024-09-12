import { IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class NextPaymentDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  orderDate: Date;
}
