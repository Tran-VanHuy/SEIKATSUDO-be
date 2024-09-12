import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductKikkakeService } from './product-kikkake.service';
import { ReqProductKikkakeDto } from './dto/product-kikkake.dto';
import { CreateProductKikkakeDto } from './dto/create-product-kikkake.dto';
import { DeleteProductKikkakeDto } from './dto/delete-product-kikkake.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Products Kikkake")
@UseGuards(RoleGuard)
@Controller('products-kikkake')
export class ProductKikkakeController {
  constructor(private readonly productKikkakeService: ProductKikkakeService) {}

  @Post('/list')
  search(@Query() query: ReqProductKikkakeDto) {
    return this.productKikkakeService.getList({
      page: query.currentPage,
      limit: query.rowsPerPage,
    });
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN)
  create(@Body() body: CreateProductKikkakeDto) {
    return this.productKikkakeService.create(body);
  }

  @Delete('/delete')
  @AllowAccess(memberType.ADMIN)
  delete(@Body() body: DeleteProductKikkakeDto) {
    return this.productKikkakeService.delete(body);
  }

  @Get('/get-code')
  getCode() {
    return this.productKikkakeService.getCode();
  }
}
