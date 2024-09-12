import { Module } from '@nestjs/common';
import { AreaShipmentController } from './area-shipment.controller';
import { AreaShipmentService } from './area-shipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaShipment } from 'src/entities/area-shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AreaShipment])],
  providers: [AreaShipmentService],
  exports: [AreaShipmentService],
  controllers: [AreaShipmentController],
})
export class AreaShipmentModule {}
