import { IsString } from 'class-validator';

export class ZipCodeResDto {
  @IsString()
  address1: string;

  @IsString()
  address2: string;

  @IsString()
  address3: string;

  @IsString()
  kana1: string;

  @IsString()
  kana2: string;

  @IsString()
  kana3: string;

  @IsString()
  prefcode: string;

  @IsString()
  zipcode: string;
}
