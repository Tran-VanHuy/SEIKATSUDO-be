import { Type } from 'class-transformer';
import { Sale } from 'src/entities/sale.entity';

export class ShipmentResDto {
  @Type(() => Number)
  shipmentId: number;

  @Type(() => Date)
  deliveryDate: Date;

  @Type(() => Number)
  deliveryTime: number;

  @Type(() => String)
  deliveryTel: string;

  @Type(() => Number)
  customerAddressId: number;

  @Type(() => String)
  deliveryName: string;

  @Type(() => String)
  deliveryZip: string;

  @Type(() => String)
  shippingNote: string;

  @Type(() => String)
  customerMemo: string;

  @Type(() => String)
  deliveryAddress1: string;

  @Type(() => String)
  deliveryAddress2: string;

  @Type(() => String)
  deliveryAddress3: string;

  constructor(sale: Sale) {
    (this.shipmentId = sale.shipment?.id),
      (this.deliveryDate = sale.shipment?.delivery_date),
      (this.deliveryTime = sale.shipment?.delivery_time),
      (this.deliveryTel = sale.shipment?.delivery_tel),
      (this.customerAddressId = sale.shipment?.customer_address_id),
      (this.deliveryName = sale.shipment?.delivery_name),
      (this.deliveryZip = sale.shipment?.delivery_zip),
      (this.shippingNote = sale.shipment?.shipping_note),
      (this.customerMemo = sale.shipment?.customer_memo),
      (this.deliveryAddress1 = sale.shipment?.delivery_address1),
      (this.deliveryAddress2 = sale.shipment?.delivery_address2),
      (this.deliveryAddress3 = sale.shipment?.delivery_address3);
  }
}
