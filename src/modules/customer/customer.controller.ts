import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/res.list.dto';
import { ReqCustomerTransactionDto } from './dto/req.list.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { CreateCustomer } from './dto/create.req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Customers")
@UseGuards(RoleGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  async findAll() {
    const customers = await this.customerService.findAll();
    return customers.map((data) => new CustomerDto(data));
  }

  @Post('/search')
  search(@Query() query: ReqCustomerTransactionDto) {
    return this.customerService.findAllCustomer(
      {
        page: query.currentPage,
        limit: query.rowsPerPage,
        route: '',
      },
      query,
    );
  }

  @Get('categories-kikkake')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  getCategoriesKikkake() {
    return this.customerService.getCategoriesKikkake();
  }

  @Get('products-kikkake')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  getProductsKikkake() {
    return this.customerService.getProductsKikkake();
  }

  @Get('master-customers')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  getMasterCustomers() {
    return this.customerService.getMasterCustomers();
  }

  @Get('parent-master-customers')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  getParentMasterName() {
    return this.customerService.getParentMasterName();
  }

  @Get('child-master-customers/:parentId')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  getChildMasterName(@Param('parentId') parentId: number) {
    return this.customerService.getChildMasterName(parentId);
  }

  @Get('/newCustomerId')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  createNewCustomerId() {
    return this.customerService.createNewCustomerId();
  }

  @Get('/:customerId')
  findOne(@Param('customerId') customerId: string) {
    return this.customerService.getCustomerById(customerId);
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  async createCustomer(@Body() body: CreateCustomer) {
    return this.customerService.createCustomer(body);
  }

  @Patch('customer-infos')
  getCustomerInfos(@Query() body) {
    return this.customerService.getCustomerInfos(body.customerId);
  }

  @Post('/sales-by-customer')
  findSalesCustomer(@Query() query: ReqCustomerTransactionDto) {
    return this.customerService.getSaleCustomer(query);
  }
}
