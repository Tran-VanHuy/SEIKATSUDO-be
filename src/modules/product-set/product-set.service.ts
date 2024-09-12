import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductSet } from 'src/entities/product-set.entity';
import { SetProduct } from 'src/entities/set-product.entity';
import { CreateProductSetDto } from './dto/create-product-set.dto';
import { SearchProductSetDto } from './dto/search-product-set.dto';

@Injectable()
export class ProductSetService extends BaseService {
  constructor(
    @InjectRepository(ProductSet) private productSetRepo: Repository<ProductSet>,
    @InjectRepository(SetProduct) private setProductRepo: Repository<SetProduct>,
    private dataSource: DataSource,
  ) {
    super();
  }

  async findAll(query: SearchProductSetDto) {
    const queryBuilder = this.productSetRepo.createQueryBuilder('PS').leftJoinAndSelect('PS.products', 'products');
    if (query.name) {
      queryBuilder.andWhere('PS.name LIKE :name', { name: `%${query.name.trim()}%` });
    }
    queryBuilder.orderBy('PS.created', 'DESC');

    const paginateData = await this.customPaginate<ProductSet>(
      queryBuilder,
      Number(query.rowsPerPage),
      Number(query.currentPage),
    );

    const productSets = paginateData.items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        total_set: item.total_set,
      };
    });

    const data = {
      items: productSets,
      meta: paginateData.meta,
    };
    return this.responseOk(data);
  }

  async createProductSet(body: CreateProductSetDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { name, subTotal, tax, discount, totalSet, setsProducts } = body;

    const dataProductSet = this.productSetRepo.create({
      name: name,
      sub_total: subTotal,
      tax: tax,
      discount: discount,
      total_set: totalSet,
    });

    try {
      const productSet = await queryRunner.manager.save(dataProductSet);

      let dataSetsProducts = [];

      for (let setProduct of setsProducts) {
        dataSetsProducts.push({
          set_id: productSet?.id,
          product_id: setProduct.productId,
          quantity: setProduct.quantity,
          total: setProduct.total,
        });
      }
      const dataSetsProductsCreate = this.setProductRepo.create(dataSetsProducts);

      await queryRunner.manager.save(dataSetsProductsCreate);

      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create product set failed', error);
      throw new BadRequestException('create product set');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductSet(productSetId: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const setsProducts = await this.setProductRepo
      .createQueryBuilder('SP')
      .where('set_id IN(:...ids)', { ids: productSetId })
      .getMany();

    const setProductsId = setsProducts?.map((setProduct) => setProduct.id);

    try {
      await queryRunner.manager.softDelete(ProductSet, productSetId);
      await queryRunner.manager.softDelete(SetProduct, setProductsId);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('delete product set failed', error);
      throw new BadRequestException('Delete product set');
    } finally {
      await queryRunner.release();
    }
  }
}
