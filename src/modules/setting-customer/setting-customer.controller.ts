import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SettingCustomerService } from './setting-customer.service';
import { ListChildSettingCustomerTransactionDto } from './dto/request.dto/list.child.dto';
import { CreateSettingCustomerTransactionDto } from './dto/request.dto/create.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Setting Customers")
@UseGuards(RoleGuard)
@Controller('setting-customers')
export class SettingCustomerController {
  constructor(private readonly settingCustomerService: SettingCustomerService) {}

  @Get('/')
  findAll(@Query() query: ListChildSettingCustomerTransactionDto) {
    return this.settingCustomerService.findAllParent({
      page: query.currentPage,
      limit: query.rowsPerPage,
      route: '',
    });
  }

  @Get('/:id/child')
  findAllChild(@Param('id') id: string, @Query() query: ListChildSettingCustomerTransactionDto) {
    return this.settingCustomerService.findAllChild(id, {
      page: query.currentPage,
      limit: query.rowsPerPage,
      route: '',
    });
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN)
  create(@Body() body: CreateSettingCustomerTransactionDto) {
    return this.settingCustomerService.create(body);
  }

  @Get('/:id/child-auto-id')
  getLastId(@Param('id') id: string) {
    return this.settingCustomerService.getNewChildId(id);
  }

  @Post('/child')
  @AllowAccess(memberType.ADMIN)
  delete(@Body() ids: number[]) {
    return this.settingCustomerService.delete(ids);
  }
}
