import { IsString, IsOptional, IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Trim } from 'src/decorators/custom-decorator';

export class AddressInfoDto {
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Transform(({ value }) => String(value))
  @Trim()
  tel1: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Transform(({ value }) => String(value))
  @Trim()
  zipCode1: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Transform(({ value }) => String(value))
  @Trim()
  address11: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Transform(({ value }) => String(value))
  @Trim()
  address12: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => String(value))
  @Trim()
  address13: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  tel2: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  zipCode2: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address21: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address22: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address23: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  tel3: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  zipCode3: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address31: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address32: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  address33: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @ValidateIf((customer) => customer.emailPC !== '')
  @IsEmail({}, { message: i18nValidationMessage('messages.customer.fomatEmail') })
  @Trim()
  emailPC: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @ValidateIf((customer) => customer.emailMobile !== '')
  @IsEmail({}, { message: i18nValidationMessage('messages.customer.fomatEmail') })
  @Trim()
  emailMobile: string;
}
