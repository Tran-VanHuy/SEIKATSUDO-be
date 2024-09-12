import { Body, Controller, Get, Post, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/get-payment.dto';
import { CreateReceivedTransaction } from './dto/create-payment.dto';
import { FindPayment } from './dto/find-payment.dto';
import { UpdateReceivedTransaction } from './dto/update-received-transaction.dto';
import { NextPaymentDto } from './dto/get-next-payment.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Payments")
@UseGuards(RoleGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('sales/:id/staffCode/:staffCode')
  async getSale(@Param('id') id: string, @Param('staffCode') staffCode: string) {
    return this.paymentService.getSale(id, staffCode);
  }

  @Get('/')
  async getPayment(@Query() query: PaymentDto) {
    return this.paymentService.getPaymentByCustomerSale(query);
  }

  @Get('/plans')
  async getPaymentPlans(@Query() query: PaymentDto) {
    return this.paymentService.getPaymentPlansByCustomerSale(query);
  }

  @Get('/transactions')
  async getReceivedTransactions(@Query() query: PaymentDto) {
    return this.paymentService.getReceivedTransactionsByCustomerSale(query);
  }

  @Post('create-received-transactions')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  async createReceivedTransaction(@Body() body: CreateReceivedTransaction) {
    return this.paymentService.saveReceivedTransaction(body);
  }

  @Get('sales/customers/:customerId')
  async getAllSales(@Param('customerId') customerId: string) {
    return this.paymentService.getAllSalesByCustomer(customerId);
  }

  @Get('/list')
  async getListPayment(@Query() query: FindPayment) {
    return this.paymentService.getlistPayment(query);
  }

  @Post('update-transactions/:transactionId')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  async updateTransaction(@Body() body: UpdateReceivedTransaction) {
    return this.paymentService.updateTransaction(body);
  }

  @Delete('transactions/:transactionId')
  @AllowAccess(memberType.ADMIN, memberType.NORMAL)
  async deleteReceivedTransaction(@Param('transactionId') transactionId: number) {
    return this.paymentService.deleteReceivedTransaction(transactionId);
  }

  @Get('customers/:customerId')
  async getNextPaymentPlanByCustomer(@Param('customerId') customerId: string, @Query() query: NextPaymentDto) {
    return this.paymentService.getNextPaymentPlanByCustomer(customerId, query.orderDate);
  }

  @Get('/transaction/:transactionId')
  async getTransaction(@Param('transactionId') transactionId: number) {
    return this.paymentService.getTransactionById(transactionId);
  }
}
