import { Type } from 'class-transformer';
import { Sale } from 'src/entities/sale.entity';

export class PaymentResDto {
  @Type(() => Number)
  paymentId: number;

  @Type(() => Number)
  fee: number;

  @Type(() => Number)
  shippingFee: number;

  @Type(() => Number)
  deposit: number;

  @Type(() => Number)
  remaining: number;

  @Type(() => Number)
  paymentPlanNumber: number;

  @Type(() => Date)
  paymentLimit: Date;

  @Type(() => Number)
  total: number;

  @Type(() => Number)
  subTotal: number;

  constructor(sale: Sale) {
    (this.paymentId = sale.payment?.id ?? sale.paymentHistories?.id),
      (this.fee = sale.payment?.fee ?? sale.paymentHistories?.fee),
      (this.shippingFee = sale?.shipping_fee),
      (this.subTotal = sale.payment?.sub_total ?? sale.paymentHistories?.sub_total),
      (this.total = sale.payment?.total ?? sale.paymentHistories?.total),
      (this.deposit = sale.payment?.deposit ?? sale.paymentHistories?.deposit),
      (this.remaining = sale.payment?.remaining ?? sale.paymentHistories?.remaining),
      (this.paymentPlanNumber = sale.payment?.payment_plan_number ?? sale.paymentHistories?.payment_plan_number),
      (this.paymentLimit = sale.payment?.payment_limit ?? sale.paymentHistories?.payment_limit);
  }
}
