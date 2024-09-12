import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ReqProductCategoryDto } from './dto/list.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Product Category")
@UseGuards(RoleGuard)
@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post('/')
  async findAll(@Query() query: ReqProductCategoryDto) {
    return this.productCategoryService.findAllProductCategory(query);
  }

  @Get('/auto-id/:productType')
  createNewProducCatetId(@Param('productType') productType: number) {
    return this.productCategoryService.createNewProductCateId(productType);
  }

  @Post('create-product-category')
  @AllowAccess(memberType.ADMIN)
  async saveProductCategory(@Body() body: CreateProductCategoryDto) {
    return this.productCategoryService.createProductCategory(body);
  }

  @Delete('delete')
  @AllowAccess(memberType.ADMIN)
  async deleteProduct(@Body() productCateIds: string[]) {
    return this.productCategoryService.deleteProductCategory(productCateIds);
  }
}
