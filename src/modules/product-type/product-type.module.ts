import { Module } from '@nestjs/common';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypes } from 'src/entities/product-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypes])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
