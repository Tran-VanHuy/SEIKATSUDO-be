import { IsString } from 'class-validator';

export class SalePdfTransaction {
  @IsString()
  saleId: string;
}
