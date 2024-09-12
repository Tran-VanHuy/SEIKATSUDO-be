import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/base/dto/paging.dto';

export class FindPayment extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  startAmount: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  endAmount: number;

  @IsOptional()
  @IsString()
  paymentType: string;
}
