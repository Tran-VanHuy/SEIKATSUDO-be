import { Controller, Get, Post, Query, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductSetService } from './product-set.service';
import { CreateProductSetDto } from './dto/create-product-set.dto';
import { SearchProductSetDto } from './dto/search-product-set.dto';
import { ProductDto } from '../product/dto/list.res.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Product Set")
@UseGuards(RoleGuard)
@Controller('product-set')
export class ProductSetController {
  constructor(private readonly productSetService: ProductSetService) {}

  @Get('/')
  async findAll(@Query() query: SearchProductSetDto) {
    return this.productSetService.findAll(query);
  }

  @Post('/create-product-set')
  @AllowAccess(memberType.ADMIN)
  async createProducSet(@Body() body: CreateProductSetDto) {
    return this.productSetService.createProductSet(body);
  }

  @Delete('/delete/')
  @AllowAccess(memberType.ADMIN)
  async deleteProducSet(@Body() productSetIds: string[]) {
    return this.productSetService.deleteProductSet(productSetIds);
  }
}
