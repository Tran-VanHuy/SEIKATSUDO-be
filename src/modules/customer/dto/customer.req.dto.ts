import { IsString, Validate, IsOptional, IsNotEmpty, MaxLength, ValidateIf, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Exist } from 'src/validator/is-exist';
import { Member } from 'src/entities/member.entity';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';
import { Customer } from 'src/entities/customer.entity';
import { MSG } from 'src/constants/constant';
import { Trim } from 'src/decorators/custom-decorator';

export class CustomerDto {
  @IsString()
  @Transform(({ value }) => String(value))
  customerId: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Validate(Exist, [Member, 'staffcode'], { message: i18nValidationMessage('messages.customer.dontExistStaff') })
  staffId: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @ValidateIf((customer) => customer.category !== '')
  @IsOptional()
  @Validate(Exist, [CategoryKikkake, 'code'], { message: i18nValidationMessage('messages.customer.dontExistCategory') })
  category: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @ValidateIf((customer) => customer.product !== '')
  @Validate(Exist, [ProductKikkake, 'code'], { message: i18nValidationMessage('messages.customer.dontExistProduct') })
  product?: string;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  @ValidateIf((customer) => customer.customerRefeId !== '')
  @Validate(Exist, [Customer, 'id'], { message: i18nValidationMessage('messages.customer.dontExistCustomer') })
  customerRefeId?: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  disableCus: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  sendMailToCus: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  callTellToCus: number;

  @IsOptional()
  @IsString()
  dateCreateCus: Date;

  @IsString()
  @Transform(({ value }) => String(value))
  @IsOptional()
  parentCode?: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @Transform(({ value }) => String(value))
  @MaxLength(40, { message: MSG.OVER_40_CHARACTERS })
  @Trim()
  customerName: string;

  @IsNotEmpty({ message: i18nValidationMessage('messages.customer.empty') })
  @IsString()
  @Transform(({ value }) => String(value))
  @MaxLength(40, { message: MSG.OVER_40_CHARACTERS })
  @Trim()
  kataName: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthCustomer: Date;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  gender: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  shippingDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateUpdate: Date;
}
