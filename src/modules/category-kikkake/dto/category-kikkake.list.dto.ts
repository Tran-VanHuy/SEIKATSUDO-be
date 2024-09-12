import { Type } from 'class-transformer';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';

export class ResCategoryKikkakeDto {
  @Type(() => Number)
  id: number;

  @Type(() => String)
  code: string;

  @Type(() => String)
  name: string;

  constructor(category: CategoryKikkake) {
    this.id = category.id;
    this.name = category.name;
    this.code = category.code;
  }
}
