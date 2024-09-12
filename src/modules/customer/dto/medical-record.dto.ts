import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Trim } from 'src/decorators/custom-decorator';

export class MedicalRecordDto {
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  mySelfTalk: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  myWifeTalk: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  otherTalk: boolean;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(255, { message: i18nValidationMessage('messages.customer.maxLength') })
  @Trim()
  textOtherTalk: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  mySelfDrink: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  myWifeDrink: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  otherDrink: boolean;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(255, { message: i18nValidationMessage('messages.customer.maxLength') })
  @Trim()
  textOtherDrink: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  legsHips: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  bloodPressure: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  pedigree: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  insomnia: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  otherSymptoms: boolean;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(255, { message: i18nValidationMessage('messages.customer.maxLength') })
  @Trim()
  otherSymptomsText: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @MaxLength(255, { message: i18nValidationMessage('messages.customer.maxLength') })
  @Trim()
  medicinesFoodsText: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  job: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  assignedPerson: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  son: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  daughter: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  wife: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  father: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  mother: boolean;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  etc: boolean;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  total: string;
}
