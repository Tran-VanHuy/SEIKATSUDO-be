import { IsString, IsOptional, IsNumber, IsDate, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMemberTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  staffCode: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  kana: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  note: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  disabled: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value))
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  authority: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value))
  confirmPassword: string;
}
