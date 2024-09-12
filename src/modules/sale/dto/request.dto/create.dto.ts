import { IsDefined, ValidateNested, IsObject, IsNotEmptyObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleDTO } from './sale.dto';
import { ProductDto } from './product.dto';
import { ShipmentDto } from './shipment.dto';
import { PaymentDto } from './payment.dto';

export class CreateSaleTransaction {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SaleDTO)
  sale: SaleDTO;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ShipmentDto)
  shipment: ShipmentDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
