import { IsString, IsOptional, IsNumber, IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Exist } from 'src/validator/is-exist';
import { ProductCategory } from 'src/entities/product-category.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Unique } from 'src/validator/is-unique';
import { Product } from 'src/entities/product.entity';
import { MSG } from 'src/constants/constant';

export class CreateEditProductDto {
  @IsString()
  @Validate(Unique, [Product, 'id'], { message: MSG.PRODUCT_UNIQUE })
  @Transform(({ value }) => String(value))
  @IsOptional()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  kana: string;

  @IsString()
  @IsOptional()
  sizeName: string;

  @IsString()
  @IsOptional()
  unit: string;

  @IsString()
  @IsOptional()
  janCode: string;

  @IsString()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  category: string;

  @IsString()
  @IsOptional()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  type1: string;

  @IsString()
  @IsOptional()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  type2: string;

  @IsString()
  @IsOptional()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  type3: string;

  @IsString()
  @IsOptional()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  type4: string;

  @IsString()
  @IsOptional()
  @Validate(Exist, [ProductCategory, 'id'], { message: i18nValidationMessage('messages.product.dontExistCategory') })
  type5: string;

  @IsNumber()
  stockCtrl: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  taxType: number;

  @IsNumber()
  @IsOptional()
  tax: number;

  @IsNumber()
  @IsOptional()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  unitCost: number;

  @IsNumber()
  @IsOptional()
  cycle: number;

  @IsNumber()
  @IsOptional()
  isDisabled: number;

  @IsString()
  @IsOptional()
  printName: string;

  @IsNumber()
  @IsOptional()
  correctAmount: number;

  @IsString()
  @IsOptional()
  shortName: string;
}
