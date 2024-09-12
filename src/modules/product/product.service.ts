import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets, Equal } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ReqProductTransactionDto } from './dto/req.list.dto';
import { constants } from 'src/constants/constant';
import { CreateEditProductDto } from './dto/create-edit-product.req.dto';
import { ProductDto } from './dto/list.res.dto';
import { ProductCategory } from 'src/entities/product-category.entity';
import { ProductCategoryDto } from './dto/list-product-category.req.dto';
import { SaleProduct } from 'src/entities/sale-product.entity';
import { SetProduct } from 'src/entities/set-product.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductCategory) private productCategoryRepo: Repository<ProductCategory>,
    @InjectRepository(SaleProduct) private saleProductRepo: Repository<SaleProduct>,
    @InjectRepository(SetProduct) private setProductRepo: Repository<SetProduct>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  findAll() {
    return this.productRepo.createQueryBuilder('P').where('P.is_disabled != 0').getMany();
  }

  async findAllProduct(options: IPaginationOptions, query: ReqProductTransactionDto) {
    try {
      const queryBuilder = this.productRepo.createQueryBuilder('P');
      if (query.id) {
        queryBuilder.andWhere('P.id = :id', { id: query.id });
      }
      if (query.name) {
        queryBuilder.andWhere(
          new Brackets((sub) => {
            sub
              .where('P.name LIKE :name', { name: `%${query.name.trim()}%` })
              .orWhere('P.sizename LIKE :name', { name: `%${query.name.trim()}%` });
          }),
        );
      }
      queryBuilder.orderBy('P.updated', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      return this.responseOk(paginateData);
    } catch (err) {
      this.logger.debug('search product failed', err);
      throw new BadRequestException('Search product failed');
    }
  }

  async findAllProductSale(options: IPaginationOptions, query: ReqProductTransactionDto) {
    try {
      const queryBuilder = this.productRepo.createQueryBuilder('P').where('P.is_disabled != 0');
      if (query.ids) {
        queryBuilder.andWhere('P.id NOT IN (:...ids)', { ids: query.ids });
      }
      if (query.id) {
        queryBuilder.andWhere('P.id LIKE :id', { id: `%${query.id}%` });
      }
      if (query.name) {
        queryBuilder.andWhere('P.name LIKE :name', { name: `%${query.name}%` });
      }

      queryBuilder.orderBy('P.created', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      const data = {
        items: paginateData.items.map((data) => new ProductDto(data)),
        meta: paginateData.meta,
      };
      return this.responseOk(data);
    } catch (err) {
      this.logger.debug('search product failed', err);
      throw new BadRequestException('Search product failed');
    }
  }

  async getAllProductCategory(query: ProductCategoryDto): Promise<ProductCategory[]> {
    const productCategory = this.productCategoryRepo.createQueryBuilder();
    if (query.type) {
      productCategory.andWhere('product_type = :type', { type: query.type });
    }
    productCategory.orderBy('created', 'DESC');
    return this.responseOk(await productCategory.getMany());
  }

  async createProduct(body: CreateEditProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      productId,
      name,
      kana,
      sizeName,
      unit,
      janCode,
      category,
      type1,
      type2,
      type3,
      type4,
      type5,
      stockCtrl,
      taxType,
      tax,
      unitPrice,
      unitCost,
      cycle,
      isDisabled,
      printName,
      correctAmount,
      shortName,
    } = body;

    const product = await this.productRepo
      .createQueryBuilder('P')
      .where('P.id = :productId', { productId })
      .withDeleted()
      .getOne();

    const productData = this.productRepo.create({
      id: productId,
      name,
      kana,
      sizename: sizeName,
      unit,
      jancode: janCode,
      category,
      type1,
      type2,
      type3,
      type4,
      type5,
      stockctrl: stockCtrl,
      taxtype: taxType,
      tax,
      unitprice: unitPrice,
      unitcost: unitCost,
      cycle,
      is_disabled: isDisabled,
      print_name: printName,
      correct_amount: correctAmount,
      short_name: shortName,
    });

    const productExist = await this.productRepo.findOne({
      where: {
        id: Equal(productId),
      },
    });

    if (productExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      if (product) {
        await queryRunner.manager.delete(Product, productId);
      }

      await queryRunner.manager.save(productData);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Create product err', err);
      throw new HttpException('Cannot insert this product', constants.STATUS_ERROR.VALUE);
    } finally {
      await queryRunner.release();
    }
  }

  async getProduct(productId: string): Promise<Product | null> {
    const product = await this.productRepo.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new BadRequestException('売上伝票が見つかりません');
    }
    return product;
  }

  async updateProduct(id: string, body: CreateEditProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const product = await this.getProduct(id);

    const {
      productId,
      name,
      kana,
      sizeName,
      unit,
      janCode,
      category,
      type1,
      type2,
      type3,
      type4,
      type5,
      stockCtrl,
      taxType,
      tax,
      unitPrice,
      unitCost,
      cycle,
      isDisabled,
      printName,
      correctAmount,
      shortName,
    } = body;

    let idUpdate;
    !productId ? (idUpdate = id) : (idUpdate = productId);
    product.id = idUpdate;
    product.name = name;
    product.kana = kana;
    product.sizename = sizeName;
    product.unit = unit;
    product.jancode = janCode;
    product.category = category;
    product.type1 = type1;
    product.type2 = type2;
    product.type3 = type3;
    product.type4 = type4;
    product.type5 = type5;
    product.stockctrl = stockCtrl;
    product.taxtype = taxType;
    product.tax = tax;
    product.unitprice = unitPrice;
    product.unitcost = unitCost;
    product.cycle = cycle;
    product.is_disabled = isDisabled;
    product.print_name = printName;
    product.correct_amount = correctAmount;
    product.short_name = shortName;

    try {
      await queryRunner.manager.update(Product, id, product);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Update product err', err);
      throw new BadRequestException('Cannot update product');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(productId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const saleProduct = await this.saleProductRepo.findOne({
      where: {
        product_id: productId,
      },
    });

    if (saleProduct) {
      throw new BadRequestException(this.i18n.t('messages.product.deleteProductInSale'));
    }

    const setProduct = await this.setProductRepo.findOne({
      where: {
        product_id: productId,
      },
    });

    if (setProduct) {
      throw new BadRequestException(this.i18n.t('messages.product.deleteProductInSet'));
    }

    try {
      await queryRunner.manager.softDelete(Product, {
        id: productId,
      });
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      this.logger.debug('Delete product err', err);
      throw new BadRequestException('Cannot delete product');
    } finally {
      await queryRunner.release();
    }
  }
}
