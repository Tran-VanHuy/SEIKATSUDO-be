import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Equal } from 'typeorm';
import { ShippingCompany } from 'src/entities/shipping-company.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import {
  constants,
  FIRST_SHIPPING_COMPANY_ID,
  SHIPPING_COMPANY_AFTER_DEFAULT,
  SHIPPING_COMPANY_DEFAULT,
} from 'src/constants/constant';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ShippingCompanyService extends BaseService {
  constructor(
    @InjectRepository(ShippingCompany) private shippingCompanyRepo: Repository<ShippingCompany>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async searchShippingCompany(options: IPaginationOptions) {
    try {
      const shippingCompanies = this.shippingCompanyRepo.createQueryBuilder('SC').orderBy('id', 'DESC');

      const paginateData = await paginate(shippingCompanies, options);
      paginateData.items.map((item) => {
        item['deletable'] = !SHIPPING_COMPANY_DEFAULT.includes(item.id);
        return item;
      });
      return this.responseOk(paginateData);
    } catch (error) {
      this.logger.debug('search shipping company failed', error);
      throw new HttpException('Search shipping company failed', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllShippingCompany() {
    try {
      const shippingCompanies = await this.shippingCompanyRepo.createQueryBuilder('SC').orderBy('id', 'DESC').getMany();

      return this.responseOk(shippingCompanies);
    } catch (error) {
      this.logger.debug('get shipping company failed', error);
      throw new HttpException('Get shipping company failed', HttpStatus.BAD_REQUEST);
    }
  }

  async createNewShippingCompanyId() {
    const shippingCompany = await this.shippingCompanyRepo
      .createQueryBuilder('SC')
      .withDeleted()
      .where("SC.id NOT IN  ('00007', '00008')")
      .orderBy('id', 'DESC')
      .limit(1)
      .getOne();
    let newId = FIRST_SHIPPING_COMPANY_ID;
    if (shippingCompany) {
      let shippingComIdFirst = String(shippingCompany.id).slice(0, 1);
      let shippingComIdLast = String(shippingCompany.id).slice(1, shippingCompany.id.length);
      newId = shippingComIdFirst + String(Number(shippingComIdLast) + 1).padStart(4, '0');
    }
    if (SHIPPING_COMPANY_DEFAULT.includes(newId)) newId = SHIPPING_COMPANY_AFTER_DEFAULT;

    return newId;
  }

  async createShippingCompany(body: CreateShippingCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id, name } = body;

    const shippingCompanyData = this.shippingCompanyRepo.create({
      id: id,
      name: name,
    });

    const shippingCompanyExist = await this.shippingCompanyRepo.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (shippingCompanyExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      await queryRunner.manager.save(shippingCompanyData);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Create shipping company err', err);
      throw new HttpException('Cannot insert this shipping company', constants.STATUS_ERROR.VALUE);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductCategory(shippingComId: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softDelete(ShippingCompany, shippingComId);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      this.logger.debug('Delete shipping company err', err);
      throw new BadRequestException('Cannot delete shipping company');
    } finally {
      await queryRunner.release();
    }
  }
}
