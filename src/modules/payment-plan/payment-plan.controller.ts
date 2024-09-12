import { Body, Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { CreatePaymentPlans } from './dto/create-payment-plans.dto';
import { UpdatePaymentPlans } from './dto/update-payment-plans.dto';
import {
  GetSaleByCustomerSaleDto,
  GetPaymentPlansByCustomerSaleDto,
  GetPaymentByCustomerSaleDto,
} from './dto/get-plan-by-customer-sale.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Payment Plans")
@UseGuards(RoleGuard)
@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  @Get('sales')
  async getSale(@Query() query: GetSaleByCustomerSaleDto) {
    return this.paymentPlanService.getSale(query);
  }

  @Get('/')
  async getPaymentPlans(@Query() query: GetPaymentPlansByCustomerSaleDto) {
    return this.paymentPlanService.getPaymentPlansByCustomerSale(query);
  }

  @Get('payment')
  async getPayment(@Query() query: GetPaymentByCustomerSaleDto) {
    return this.paymentPlanService.getPaymentByCustomerSale(query);
  }

  @Post('save-payment-plan')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  async savePaymentPlan(@Body() body: CreatePaymentPlans) {
    return this.paymentPlanService.savePaymentPlan(body);
  }

  @Get('/plan-new/:saleId')
  async getPlanNew(@Param('saleId') saleId: string) {
    return this.paymentPlanService.getPlanNew(saleId);
  }

  @Post('/update-plans')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  async updatePlans(@Body() body: UpdatePaymentPlans) {
    return this.paymentPlanService.updatePaymentPlan(body);
  }
}
