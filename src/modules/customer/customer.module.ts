import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';
import { MasterCustomer } from 'src/entities/master-customer.entity';
import { Category } from 'src/entities/category-customer.entity';
import { Sale } from 'src/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CategoryKikkake, ProductKikkake, MasterCustomer, Category, Sale])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
