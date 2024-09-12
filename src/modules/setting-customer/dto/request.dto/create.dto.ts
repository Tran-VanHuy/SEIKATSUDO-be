import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSettingCustomerTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  customerCode: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  childCode: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  childName: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  parentId: number;
}
