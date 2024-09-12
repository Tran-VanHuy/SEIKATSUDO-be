import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ProductCategory } from 'src/entities/product-category.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ReqProductCategoryDto } from './dto/list.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { PRODUCT_CATEGORY, constants } from 'src/constants/constant';
import { Product } from 'src/entities/product.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductCategoryService extends BaseService {
  constructor(
    @InjectRepository(ProductCategory) private productCategoryRepo: Repository<ProductCategory>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async findAllProductCategory(query: ReqProductCategoryDto) {
    try {
      const productCategory = this.productCategoryRepo
        .createQueryBuilder('PC')
        .leftJoinAndSelect('PC.category', 'category')
        .leftJoinAndSelect('PC.type1', 'type1')
        .leftJoinAndSelect('PC.type2', 'type2')
        .leftJoinAndSelect('PC.type3', 'type3')
        .leftJoinAndSelect('PC.type4', 'type4')
        .leftJoinAndSelect('PC.type5', 'type5')
        .where('PC.product_type = :productType', { productType: query.productType })
        .orderBy('PC.created', 'DESC');

      const paginateData = await this.customPaginate<ProductCategory>(
        productCategory,
        Number(query.rowsPerPage),
        Number(query.currentPage),
      );
      const categories = paginateData.items.map((data) => {
        return {
          check:
            data.type1.length > 0 ||
            data.type2.length > 0 ||
            data.type3.length > 0 ||
            data.type4.length > 0 ||
            data.type5.length > 0 ||
            data.category
              ? false
              : true,
          id: data.id,
          name: data.name,
          productText: data.product_text,
        };
      });

      const data = {
        items: categories,
        meta: paginateData.meta,
      };
      return this.responseOk(data);
    } catch (error) {
      this.logger.debug('search product category failed', error);
      throw new BadRequestException('Search product category failed');
    }
  }

  newProductCateId(id: string, productCategory, maxId: string) {
    let newId = id;
    if (productCategory) {
      switch (productCategory.id) {
        case maxId:
          newId = PRODUCT_CATEGORY[5].ID_NA;
          break;
        default:
          let productIdFirst = String(productCategory.id).slice(0, 1);
          let productIdLast = String(productCategory.id).slice(1, productCategory.id.length);
          newId = productIdFirst + String(Number(productIdLast) + 1).padStart(3, '0');
          break;
      }
    }
    return newId;
  }

  async createNewProductCateId(productType: number) {
    const productCategory = await this.productCategoryRepo
      .createQueryBuilder('PC')
      .where('PC.product_type = :productType', { productType: productType })
      .withDeleted()
      .orderBy('created', 'DESC')
      .limit(1)
      .getOne();
    switch (productType) {
      case PRODUCT_CATEGORY[0].TYPE:
        return this.newProductCateId(
          PRODUCT_CATEGORY[0].FIRST_PRODUCT_CATEGORY_ONE,
          productCategory,
          PRODUCT_CATEGORY[0].MAX,
        );
      case PRODUCT_CATEGORY[1].TYPE:
        return this.newProductCateId(
          PRODUCT_CATEGORY[1].FIRST_PRODUCT_CATEGORY_TWO,
          productCategory,
          PRODUCT_CATEGORY[1].MAX,
        );
      case PRODUCT_CATEGORY[2].TYPE:
        return this.newProductCateId(
          PRODUCT_CATEGORY[2].FIRST_PRODUCT_CATEGORY_THREE,
          productCategory,
          PRODUCT_CATEGORY[2].MAX,
        );
      case PRODUCT_CATEGORY[3].TYPE:
        return this.newProductCateId(
          PRODUCT_CATEGORY[3].FIRST_PRODUCT_CATEGORY_FOUR,
          productCategory,
          PRODUCT_CATEGORY[3].MAX,
        );
      case PRODUCT_CATEGORY[4].TYPE:
        return this.newProductCateId(
          PRODUCT_CATEGORY[4].FIRST_PRODUCT_CATEGORY_FIVE,
          productCategory,
          PRODUCT_CATEGORY[4].MAX,
        );
    }
  }

  async createProductCategory(body: CreateProductCategoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { productCateId, name, productText, productType } = body;

    const productCateOld = await this.productCategoryRepo.findOne({
      where: {
        id: productCateId,
      },
    });

    let productTypeSelection = PRODUCT_CATEGORY.find((item) => {
      return item.TYPE == productType;
    });

    if (productCateId == PRODUCT_CATEGORY[5].ID_NA) {
      throw new BadRequestException(
        `${productTypeSelection.NAME}の区分コード制限に達した。他の区分を選択してください。`,
      );
    }

    if (productCateOld) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    const productCategoryData = this.productCategoryRepo.create({
      id: productCateId,
      name: name,
      product_text: productText,
      product_type: productType,
    });

    try {
      await queryRunner.manager.save(productCategoryData);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Create product category err', err);
      throw new HttpException('Cannot insert this product category', constants.STATUS_ERROR.VALUE);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductCategory(productCateIds: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const products = await this.productRepo
      .createQueryBuilder()
      .andWhere(
        new Brackets((sub) => {
          sub
            .where('category IN(:...ids)', { ids: productCateIds })
            .orWhere('type1 IN(:...ids)', { ids: productCateIds })
            .orWhere('type2 IN(:...ids)', { ids: productCateIds })
            .orWhere('type3 IN(:...ids)', { ids: productCateIds })
            .orWhere('type4 IN(:...ids)', { ids: productCateIds })
            .orWhere('type5 IN(:...ids)', { ids: productCateIds });
        }),
      )
      .getMany();
    if (products.length > 0) {
      throw new BadRequestException(this.i18n.t('messages.category.dontDelete'));
    }

    try {
      await queryRunner.manager.softDelete(ProductCategory, productCateIds);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      this.logger.debug('Delete product category err', err);
      throw new BadRequestException('Cannot delete product category');
    } finally {
      await queryRunner.release();
    }
  }
}
