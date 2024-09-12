import { Module } from '@nestjs/common';
import { ShippingCompanyController } from './shipping-company.controller';
import { ShippingCompanyService } from './shipping-company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingCompany } from 'src/entities/shipping-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCompany])],
  controllers: [ShippingCompanyController],
  providers: [ShippingCompanyService],
})
export class ShippingCompanyModule {}
