import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/list.res.dto';
import { ReqProductTransactionDto } from './dto/req.list.dto';
import { CreateEditProductDto } from './dto/create-edit-product.req.dto';
import { ProductCategoryDto } from './dto/list-product-category.req.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Products")
@UseGuards(RoleGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async findAll() {
    let products = await this.productService.findAll();
    return products.map((data) => new ProductDto(data));
  }

  @Post('/search-product-sale')
  searchProductSale(@Query() query: ReqProductTransactionDto) {
    return this.productService.findAllProductSale(
      {
        page: query.currentPage,
        limit: query.rowsPerPage,
        route: '',
      },
      query,
    );
  }

  @Post('/search-product')
  searchProduct(@Query() query: ReqProductTransactionDto) {
    return this.productService.findAllProduct(
      {
        page: query.currentPage,
        limit: query.rowsPerPage,
        route: '',
      },
      query,
    );
  }

  @Get('/categories')
  @AllowAccess(memberType.ADMIN)
  async getAllProductCategory(@Query() query: ProductCategoryDto) {
    return this.productService.getAllProductCategory(query);
  }

  @Post('create-product')
  @AllowAccess(memberType.ADMIN)
  async saveProduct(@Body() body: CreateEditProductDto) {
    return this.productService.createProduct(body);
  }

  @Get('/:productId')
  @AllowAccess(memberType.ADMIN)
  async getProductById(@Param('productId') productId: string) {
    return this.productService.getProduct(productId);
  }

  @Put('update-product/:id')
  @AllowAccess(memberType.ADMIN)
  async updateProduct(@Param('id') id: string, @Body() body: CreateEditProductDto) {
    return this.productService.updateProduct(id, body);
  }

  @Delete('/:productId')
  @AllowAccess(memberType.ADMIN)
  async deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
