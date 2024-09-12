import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypes } from 'src/entities/product-type.entity';

@Injectable()
export class ProductTypeService extends BaseService {
  constructor(@InjectRepository(ProductTypes) private productTypeRepo: Repository<ProductTypes>) {
    super();
  }

  async findAll() {
    return this.productTypeRepo.find();
  }
}
