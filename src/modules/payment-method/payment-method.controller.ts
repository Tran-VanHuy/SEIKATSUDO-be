import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodTransactionDto } from './dto/request.dto/create.dto';
import { ListPaymentMethodTransactionDto } from './dto/request.dto/list.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Payment Method")
@UseGuards(RoleGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get('/')
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Post('/')
  search(@Query() query: ListPaymentMethodTransactionDto) {
    return this.paymentMethodService.search({
      page: query.currentPage,
      limit: query.rowsPerPage,
      route: '',
    });
  }

  @Get('/auto-id')
  getLastId() {
    return this.paymentMethodService.getNewIdPaymentMethod();
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN)
  create(@Body() body: CreatePaymentMethodTransactionDto) {
    return this.paymentMethodService.create(body);
  }

  @Delete('/:id')
  @AllowAccess(memberType.ADMIN)
  delete(@Param('id') id: string) {
    return this.paymentMethodService.delete(id);
  }
}
