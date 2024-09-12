import { IsString } from 'class-validator';

export class ZipCodeDto {
  @IsString()
  zipCode: string;
}
