import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ResProductKikkakeDto } from './dto/product-kikkake.list.dto';
import { CreateProductKikkakeDto } from './dto/create-product-kikkake.dto';
import { DeleteProductKikkakeDto } from './dto/delete-product-kikkake.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductKikkakeService extends BaseService {
  constructor(
    @InjectRepository(ProductKikkake) private readonly productRepo: Repository<ProductKikkake>,
    private readonly i18n: I18nService,
    private dataSource: DataSource,
  ) {
    super();
  }

  async getList(options: IPaginationOptions) {
    try {
      const queryBuilder = this.productRepo.createQueryBuilder('C');
      queryBuilder.orderBy('C.created', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      const data = {
        items: paginateData.items.map((data) => new ResProductKikkakeDto(data)),
        meta: paginateData.meta,
      };

      return this.responseOk(data);
    } catch (err) {
      this.logger.debug('Product kikkake list failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.product.error.getList'));
    }
  }

  async create(body: CreateProductKikkakeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const productKikkake = await this.productRepo.findOne({
      where: {
        code: Equal(body.code),
      },
    });

    if (productKikkake) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      const product = this.productRepo.create(body);
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Create product kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.product.error.create'));
    } finally {
      await queryRunner.release();
    }
  }

  async delete(body: DeleteProductKikkakeDto) {
    try {
      const datas = await this.productRepo
        .createQueryBuilder()
        .softDelete()
        .where('id IN (:...id)', { id: body.ids })
        .execute();

      return this.responseOk(datas);
    } catch (err) {
      this.logger.debug('Delete product kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.product.error.delete'));
    }
  }

  async getCode() {
    try {
      const productLast = await this.productRepo
        .createQueryBuilder('C')
        .select('C.code')
        .withDeleted()
        .orderBy('created', 'DESC')
        .limit(1)
        .getOne();
      const code = this.renderCode(productLast?.code);

      return this.responseOk({ code });
    } catch (err) {
      this.logger.debug('Get code product kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.getCode'));
    }
  }

  renderCode(prevCode?: string) {
    const lengthCodeMax = 4;
    const prevNumber = Number(prevCode || '') + 1;
    const diff = lengthCodeMax - prevNumber.toString().length;

    if (diff) {
      const zeros = '0'.repeat(diff);

      return zeros + prevNumber;
    } else {
      return prevNumber;
    }
  }
}
