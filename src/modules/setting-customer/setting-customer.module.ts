import { Module } from '@nestjs/common';
import { SettingCustomerController } from './setting-customer.controller';
import { SettingCustomerService } from './setting-customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCustomer } from 'src/entities/master-customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MasterCustomer])],
  providers: [SettingCustomerService],
  exports: [SettingCustomerService],
  controllers: [SettingCustomerController],
})
export class SettingCustomerModule {}
