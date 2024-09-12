import {
  IsDefined,
  ValidateNested,
  IsObject,
  IsNotEmptyObject,
  IsArray,
  IsString,
  Validate,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { CategoriesCustomersDto } from './category-customer.dto';
import { CustomerDto } from './customer.req.dto';
import { AddressInfoDto } from './address-info.dto';
import { RemakesDto } from './remakes.dto';
import { MedicalRecordDto } from './medical-record.dto';
import { Type } from 'class-transformer';

export class CreateCustomer {
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressInfo: AddressInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RemakesDto)
  remarks: RemakesDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MedicalRecordDto)
  medicalRecord: MedicalRecordDto;

  @IsArray()
  @IsOptional()
  @Type(() => CategoriesCustomersDto)
  categoriesCustomer: CategoriesCustomersDto[];
}
