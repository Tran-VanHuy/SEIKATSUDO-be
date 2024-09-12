import { Type } from 'class-transformer';
import { Product } from 'src/entities/product.entity';

export class ProductDto {
  @Type(() => String)
  id: string;

  @Type(() => String)
  name: string;

  @Type(() => String)
  kana: string;

  @Type(() => String)
  sizeName: string;

  @Type(() => String)
  unit: string;

  @Type(() => String)
  janCode: string;

  @Type(() => Number)
  taxtype: number;

  @Type(() => Number)
  tax: number;

  @Type(() => Number)
  unitPrice: number;

  @Type(() => Number)
  unitcost: number;

  @Type(() => Number)
  cycle: number;

  @Type(() => Number)
  is_disabled: number;

  @Type(() => String)
  print_name: string;

  @Type(() => Number)
  correct_amount: number;

  @Type(() => String)
  short_name: string;

  @Type(() => Boolean)
  check: boolean;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.kana = product.kana;
    this.janCode = product.jancode;
    this.sizeName = product.sizename;
    this.unitPrice = product.unitprice;
    this.tax = product.tax;
    this.unit = product.unit;
    this.taxtype = product.taxtype;
    this.check = false;
  }
}
