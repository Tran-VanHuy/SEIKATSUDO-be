import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class HolidayDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  orderDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  days: number;
}
