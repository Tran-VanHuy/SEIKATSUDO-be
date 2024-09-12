import { Module } from '@nestjs/common';
import { ProductSetController } from './product-set.controller';
import { ProductSetService } from './product-set.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSet } from 'src/entities/product-set.entity';
import { SetProduct } from 'src/entities/set-product.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSet, SetProduct, Product])],
  controllers: [ProductSetController],
  providers: [ProductSetService],
})
export class ProductSetModule {}
