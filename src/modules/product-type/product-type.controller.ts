import { Controller, Get, Post, Query } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Products")
@Controller('products')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Get('/')
  async findAll() {
    return this.productTypeService.findAll();
  }
}
