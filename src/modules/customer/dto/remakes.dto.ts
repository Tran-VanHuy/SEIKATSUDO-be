import { IsString, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Trim } from 'src/decorators/custom-decorator';

export class RemakesDto {
  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(100, { message: i18nValidationMessage('messages.customer.fomatEmail') })
  @Trim()
  note1: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(100, { message: i18nValidationMessage('messages.customer.fomatEmail') })
  @Trim()
  note2: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @Trim()
  customerNote: string;
}
