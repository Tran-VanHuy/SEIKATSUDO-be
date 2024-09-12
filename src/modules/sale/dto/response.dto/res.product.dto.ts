import { Type } from 'class-transformer';
import { SaleProduct } from 'src/entities/sale-product.entity';

export class ProductResDto {
  @Type(() => String)
  id: string;

  @Type(() => String)
  name: string;

  @Type(() => Number)
  amount: number;

  @Type(() => Number)
  sort: number;

  @Type(() => Number)
  subTax: number;

  @Type(() => Number)
  tax: number;

  @Type(() => Number)
  subtotal: number;

  @Type(() => String)
  unit: string;

  @Type(() => Number)
  type: number;

  @Type(() => Number)
  unitPrice: number;

  constructor(saleProduct: SaleProduct) {
    (this.id = saleProduct.product_id),
      (this.name = saleProduct.product?.name),
      (this.amount = saleProduct.amount),
      (this.sort = saleProduct.sort),
      (this.subTax = saleProduct.subtax),
      (this.tax = saleProduct.product?.tax),
      (this.subtotal = saleProduct.subtotal),
      (this.unit = saleProduct.unit),
      (this.type = saleProduct.type),
      (this.unitPrice = saleProduct.unit_price);
  }
}
