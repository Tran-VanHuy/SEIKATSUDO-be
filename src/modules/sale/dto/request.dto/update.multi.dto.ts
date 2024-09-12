import { IsDefined, ValidateNested, IsObject, IsNotEmptyObject, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleDTO } from './sale.dto';

export class UpdateMultiTransaction {
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDTO)
  saleSelected: SaleDTO[];
}
