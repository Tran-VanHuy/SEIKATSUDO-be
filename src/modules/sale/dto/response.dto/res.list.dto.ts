import { Type } from 'class-transformer';
import { STATUS_SALE_VALUE } from 'src/constants/constant';
import { Sale } from 'src/entities/sale.entity';

export class ResListSaleDto {
  @Type(() => String)
  saleId: string;

  @Type(() => String)
  customerId: string;

  @Type(() => String)
  customerName: string;

  @Type(() => Number)
  discount: number;

  @Type(() => Date)
  orderDate: Date;

  @Type(() => String)
  shipmentStaffId: string;

  @Type(() => Number)
  shippingCheck: number;

  @Type(() => String)
  shippingCompanyId: string;

  @Type(() => String)
  shippingCompanyName: string;

  @Type(() => String)
  shippingConfirmStaffId: string;

  @Type(() => String)
  shippingConfirmStaffName: string;

  @Type(() => Date)
  shippingDate: Date;

  @Type(() => Number)
  shippingFee: number;

  @Type(() => String)
  shippingOriginId: string;

  @Type(() => String)
  staffId: string;

  @Type(() => String)
  staffName: string;

  @Type(() => Number)
  status: number;

  @Type(() => String)
  statusChangeReason: string;

  @Type(() => Number)
  subTotal: number;

  @Type(() => Number)
  total: number;

  @Type(() => String)
  paymentType: string;

  @Type(() => String)
  shippingType: string;

  @Type(() => Boolean)
  editable: boolean;

  @Type(() => Boolean)
  deletable: boolean;

  @Type(() => Date)
  dayShipping: Date;

  @Type(() => Array<number>)
  statusEnable: number[];

  @Type(() => String)
  shipmentStaffName: string;

  @Type(() => Boolean)
  hasPayment: boolean;

  @Type(() => Number)
  fee: number;

  @Type(() => Number)
  paymentTotal: number;

  @Type(() => Number)
  subTax: number;

  constructor(sale: Sale) {
    this.saleId = sale.id;
    this.customerId = sale.customer_id;
    this.customerName = sale.customer_name;
    this.discount = sale.discount;
    this.orderDate = sale.order_date;
    this.shipmentStaffId = sale.shipment_staff_id;
    this.shipmentStaffName = sale.memberShipmentStaff?.name;
    this.shippingCheck = sale.shipping_check;
    this.shippingCompanyId = sale.shipping_company_id;
    this.shippingCompanyName = sale.shipping_company_name;
    this.shippingConfirmStaffId = sale.shipping_confirm_staff_id;
    this.shippingDate = sale.shipping_date;
    this.shippingFee = sale.shipping_fee;
    this.shippingOriginId = sale.shipping_origin_id;
    this.staffId = sale.staff_id;
    this.status = sale.status;
    this.statusChangeReason = sale.status_change_reason;
    this.total = sale.total;
    this.subTotal = sale.sub_total;
    this.paymentType = sale.payment?.payment_type ?? sale.paymentHistories?.payment_type;
    this.shippingType = sale.shipping_type;
    this.shippingConfirmStaffName = sale.memberConfirmStaff?.name;
    this.staffName = sale.staff?.name;
    this.editable =
      [STATUS_SALE_VALUE.ORDERED, STATUS_SALE_VALUE.ORDER_CONFIRMED, STATUS_SALE_VALUE.SHIPPED].includes(sale.status) &&
      !!sale.payment;
    this.deletable = [STATUS_SALE_VALUE.ORDERED].includes(sale.status) && !!sale.payment;
    this.hasPayment = !!sale.payment;
    this.dayShipping = sale.day_shipping;
    let statusEnable = [];
    switch (sale.status) {
      case STATUS_SALE_VALUE.ORDERED:
        statusEnable = [STATUS_SALE_VALUE.ORDERED, STATUS_SALE_VALUE.CANCEL];
        break;
      case STATUS_SALE_VALUE.SHIPPED:
        statusEnable = [STATUS_SALE_VALUE.SHIPPED, STATUS_SALE_VALUE.CANCEL, STATUS_SALE_VALUE.REMOVE_PAYMENT];
        break;
      default:
        statusEnable = [sale.status];
        break;
    }
    this.statusEnable = statusEnable;
    this.fee = sale.payment?.fee ?? sale.paymentHistories?.fee;
    this.paymentTotal = sale.payment?.total ?? sale.paymentHistories?.total;
    let subTax = 0;
    if (sale.saleProducts) {
      sale.saleProducts.map((data) => {
        subTax = subTax + data.subtax;
      });
    }
    this.subTax = subTax;
  }
}
