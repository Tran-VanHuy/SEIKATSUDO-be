import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ResCategoryKikkakeDto } from './dto/category-kikkake.list.dto';
import { CreateCategoryKikkakeDto } from './dto/create-category-kikkake.dto';
import { ProductKikkakeService } from '../product-kikkake/product-kikkake.service';
import { DeleteProductKikkakeDto } from '../product-kikkake/dto/delete-product-kikkake.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoryKikkakeService extends BaseService {
  constructor(
    @InjectRepository(CategoryKikkake) private readonly categoryRepo: Repository<CategoryKikkake>,
    private productKikkakeService: ProductKikkakeService,
    private readonly i18n: I18nService,
    private dataSource: DataSource,
  ) {
    super();
  }

  async getList(options: IPaginationOptions) {
    try {
      const queryBuilder = this.categoryRepo.createQueryBuilder('C');
      queryBuilder.orderBy('C.created', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      const data = {
        items: paginateData.items.map((data) => new ResCategoryKikkakeDto(data)),
        meta: paginateData.meta,
      };

      return this.responseOk(data);
    } catch (err) {
      this.logger.debug('Category kikkake list failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.category.error.getList'));
    }
  }

  async create(body: CreateCategoryKikkakeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const categoryExist = await this.categoryRepo.findOne({
      where: {
        code: Equal(body.code),
      },
    });

    if (categoryExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      const category = this.categoryRepo.create(body);
      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Create category kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.category.error.create'));
    } finally {
      await queryRunner.release();
    }
  }

  async delete(body: DeleteProductKikkakeDto) {
    try {
      const datas = await this.categoryRepo
        .createQueryBuilder()
        .softDelete()
        .where('id IN (:...id)', { id: body.ids })
        .execute();

      return this.responseOk(datas);
    } catch (err) {
      this.logger.debug('Delete category kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.category.error.delete'));
    }
  }

  async getCode() {
    try {
      const categoryLast = await this.categoryRepo
        .createQueryBuilder('C')
        .select('C.code')
        .withDeleted()
        .orderBy('code', 'DESC')
        .limit(1)
        .getOne();
      const code = this.productKikkakeService.renderCode(categoryLast?.code);

      return this.responseOk({ code });
    } catch (err) {
      this.logger.debug('Get code category kikkake failed', err);
      throw new BadRequestException(this.i18n.t('messages.menuKikkake.getCode'));
    }
  }
}
