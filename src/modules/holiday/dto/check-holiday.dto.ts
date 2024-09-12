import { IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CheckHolidayDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  checkDate: Date;
}
