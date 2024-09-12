import { Type } from 'class-transformer';
import { AreaShipment } from 'src/entities/area-shipment.entity';

export class areaShipmentDto {
  @Type(() => Number)
  id: number;

  @Type(() => Number)
  code: number;

  @Type(() => String)
  area: string;

  @Type(() => Number)
  shipmentDay: number;

  @Type(() => Number)
  fee: number;

  constructor(areaShipment: AreaShipment) {
    this.id = areaShipment.id;
    this.code = areaShipment.area_id;
    this.area = areaShipment.name;
    this.shipmentDay = areaShipment.days;
    this.fee = areaShipment.amount;
  }
}
