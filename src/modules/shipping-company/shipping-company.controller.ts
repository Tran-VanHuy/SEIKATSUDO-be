import { Controller, Get, Post, Query, Delete, Body, UseGuards } from '@nestjs/common';
import { ShippingCompanyService } from './shipping-company.service';
import { ListShippingCompaniesDto } from './dto/list.dto';
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Shipping Company")
@UseGuards(RoleGuard)
@Controller('shipping-company')
export class ShippingCompanyController {
  constructor(private readonly shippingCompanyService: ShippingCompanyService) {}

  @Post('/')
  async search(@Query() query: ListShippingCompaniesDto) {
    return this.shippingCompanyService.searchShippingCompany({
      page: query.currentPage,
      limit: query.rowsPerPage,
      route: '',
    });
  }

  @Get('/auto-id')
  createNewShippingCompanyId() {
    return this.shippingCompanyService.createNewShippingCompanyId();
  }

  @Post('create-shipping-company')
  @AllowAccess(memberType.ADMIN)
  async saveProductCategory(@Body() body: CreateShippingCompanyDto) {
    return this.shippingCompanyService.createShippingCompany(body);
  }

  @Delete('delete')
  @AllowAccess(memberType.ADMIN)
  async deleteProduct(@Body() shippingComId: string[]) {
    return this.shippingCompanyService.deleteProductCategory(shippingComId);
  }

  @Get('/')
  getAll() {
    return this.shippingCompanyService.getAllShippingCompany();
  }
}
