import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CategoryKikkakeService } from './category-kikkake.service';
import { ReqCategoryKikkakeDto } from './dto/category-kikkake.dto';
import { CreateCategoryKikkakeDto } from './dto/create-category-kikkake.dto';
import { DeleteProductKikkakeDto } from '../product-kikkake/dto/delete-product-kikkake.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Categories Kikkake")
@UseGuards(RoleGuard)
@Controller('categories-kikkake')
export class CategoryKikkakeController {
  constructor(private readonly categoryKikkakeService: CategoryKikkakeService) {}

  @Post('/list')
  search(@Query() query: ReqCategoryKikkakeDto) {
    return this.categoryKikkakeService.getList({
      page: query.currentPage,
      limit: query.rowsPerPage,
    });
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN)
  create(@Body() body: CreateCategoryKikkakeDto) {
    return this.categoryKikkakeService.create(body);
  }

  @Delete('/delete')
  @AllowAccess(memberType.ADMIN)
  delete(@Body() body: DeleteProductKikkakeDto) {
    return this.categoryKikkakeService.delete(body);
  }

  @Get('/get-code')
  getCode() {
    return this.categoryKikkakeService.getCode();
  }
}
