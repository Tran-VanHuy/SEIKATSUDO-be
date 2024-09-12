import { Module } from '@nestjs/common';
import { CategoryKikkakeController } from './category-kikkake.controller';
import { CategoryKikkakeService } from './category-kikkake.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { ProductKikkakeModule } from '../product-kikkake/product-kikkake.module';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryKikkake, ProductKikkake]), ProductKikkakeModule],
  controllers: [CategoryKikkakeController],
  providers: [CategoryKikkakeService],
})
export class CategoryKikkakeModule {}
