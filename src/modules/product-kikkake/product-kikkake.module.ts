import { Module } from '@nestjs/common';
import { ProductKikkakeController } from './product-kikkake.controller';
import { ProductKikkakeService } from './product-kikkake.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductKikkake])],
  controllers: [ProductKikkakeController],
  providers: [ProductKikkakeService],
  exports: [ProductKikkakeService],
})
export class ProductKikkakeModule {}
