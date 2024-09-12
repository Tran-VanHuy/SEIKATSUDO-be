import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductTypeService } from '../product-type/product-type.service';
import { ProductTypeModule } from '../product-type/product-type.module';
import { ProductTypes } from 'src/entities/product-type.entity';
import { ProductCategory } from 'src/entities/product-category.entity';
import { SaleProduct } from 'src/entities/sale-product.entity';
import { SetProduct } from 'src/entities/set-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductTypes, ProductCategory, SaleProduct, SetProduct]),
    ProductTypeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductTypeService],
})
export class ProductModule {}
