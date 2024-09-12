import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { MasterCustomer } from 'src/entities/master-customer.entity';
import { settingCustomerDto } from './dto/response.dto/list.child.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateSettingCustomerTransactionDto } from './dto/request.dto/create.dto';
import { IS_UPDATE_SETTING_CUSTOMER, MSG } from 'src/constants/constant';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SettingCustomerService extends BaseService {
  constructor(
    @InjectRepository(MasterCustomer) private readonly settingCustomerRepo: Repository<MasterCustomer>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async findAllParent(options: IPaginationOptions) {
    const queryBuilder = this.settingCustomerRepo
      .createQueryBuilder('SC')
      .where('SC.parent_id IS NULL')
      .orderBy('SC.id', 'ASC');
    const paginateData = await paginate(queryBuilder, options);
    const data = {
      items: paginateData.items.map((data) => new settingCustomerDto(data)),
      meta: paginateData.meta,
    };
    return this.responseOk(data);
  }

  async findAllChild(parentId: string, options: IPaginationOptions) {
    const queryBuilder = this.settingCustomerRepo
      .createQueryBuilder('SC')
      .where('SC.parent_id = :parentId', { parentId })
      .orderBy('SC.id', 'ASC');
    const paginateData = await paginate(queryBuilder, options);
    const data = {
      items: paginateData.items.map((data) => new settingCustomerDto(data)),
      meta: paginateData.meta,
    };
    return this.responseOk(data);
  }

  async create(body: CreateSettingCustomerTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let childData = {};
    let parentData = {};
    let errors = {};

    if (body.parentId) {
      const oldParent = await this.settingCustomerRepo
        .createQueryBuilder('SC')
        .where('SC.id != :parentId', { parentId: body.parentId })
        .andWhere('SC.customer_code = :customerCode', { customerCode: body.customerCode })
        .getCount();
      if (oldParent > 0) {
        errors['customerCode'] = MSG.DUPLICATE_PARENT_SETTING_CUSTOMER;
      }

      const oldChild = await this.settingCustomerRepo
        .createQueryBuilder('SC')
        .where('SC.parent_id = :parentId', { parentId: body.parentId })
        .andWhere('SC.child_name = :childName', { childName: body.childName })
        .getCount();
      if (oldChild > 0) {
        errors['childName'] = MSG.DUPLICATE_CHILD_SETTING_CUSTOMER;
      }
      if (body.customerCode === MSG.SETTING_CUSTOMER_DEFAULT) {
        errors['customer_code'] = MSG.DUPLICATE_WITH_SETTING_CUSTOMER_DEFAULT;
      }
      if (Object.keys(errors).length > 0) throw new HttpException({ message: errors }, HttpStatus.BAD_REQUEST);
      parentData['customer_code'] = body.customerCode;
      parentData['is_update'] = IS_UPDATE_SETTING_CUSTOMER;
      childData['child_code'] = body.childCode;
      childData['child_name'] = body.childName;
      childData['is_update'] = IS_UPDATE_SETTING_CUSTOMER;
      childData['parent_id'] = body.parentId;
    }

    const childExist = await this.settingCustomerRepo
      .createQueryBuilder('SC')
      .where('SC.parent_id = :parentId', { parentId: body.parentId })
      .andWhere('SC.child_code = :childCode', { childCode: body.childCode })
      .getCount();
    if (childExist > 0) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      if (body.parentId) {
        await queryRunner.manager.update(MasterCustomer, body.parentId, parentData);
        await queryRunner.manager.save(MasterCustomer, childData);
      }
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create staff failed', err);
      throw new HttpException(MSG.SETTING_CUSTOMER + MSG.CREATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async getNewChildId(parentId: string) {
    const child = await this.settingCustomerRepo
      .createQueryBuilder('SC')
      .where('SC.parent_id = :parentId', { parentId })
      .orderBy('created', 'DESC')
      .limit(1)
      .getOne();
    let newId = '';
    let revenueIdLast = child ? String(child.child_code).slice(2, child.child_code.length) : `0`;
    newId = parentId.padEnd(2, '0') + String(Number(revenueIdLast) + 1).padStart(3, '0');

    return this.responseOk(newId);
  }

  async delete(ids: number[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const checkSettingBeUse = await this.settingCustomerRepo
      .createQueryBuilder('SC')
      .leftJoinAndSelect('SC.categoryCustomer', 'CC')
      .whereInIds(ids)
      .getMany();
    let settingIsUse = '';
    checkSettingBeUse.forEach((setting) => {
      if (setting.categoryCustomer.length > 0) {
        settingIsUse = settingIsUse + (settingIsUse.length > 0 ? '、' : '') + setting.child_name;
      }
    });
    if (settingIsUse.length > 0)
      throw new HttpException(settingIsUse + MSG.SETTING_CUSTOMER_BE_USE, HttpStatus.BAD_REQUEST);

    try {
      await queryRunner.manager.delete(MasterCustomer, ids);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('delete payment method failed', err);
      throw new HttpException(MSG.SETTING_CUSTOMER + MSG.DELETE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
