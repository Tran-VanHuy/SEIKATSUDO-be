import { Type } from 'class-transformer';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';

export class ResProductKikkakeDto {
  @Type(() => Number)
  id: number;

  @Type(() => String)
  code: string;

  @Type(() => String)
  name: string;

  constructor(category: ProductKikkake) {
    this.id = category.id;
    this.name = category.name;
    this.code = category.code;
  }
}
