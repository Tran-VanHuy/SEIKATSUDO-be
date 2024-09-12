import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { PaymentMethods } from 'src/entities/payment-method.entity';
import { PaymentMethodDto } from './dto/response.dto/list.dto';
import { DEFAULT_PAYMENT_METHOD, FIRST_PAYMENT_METHOD_ID, MSG } from 'src/constants/constant';
import { CreatePaymentMethodTransactionDto } from './dto/request.dto/create.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PaymentMethodService extends BaseService {
  constructor(
    @InjectRepository(PaymentMethods) private readonly paymentMethodService: Repository<PaymentMethods>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async findAll() {
    const res = await this.paymentMethodService.createQueryBuilder('PM').orderBy('id', 'DESC').getMany();

    return this.responseOk(res.map((data) => new PaymentMethodDto(data)));
  }

  async search(options: IPaginationOptions) {
    const res = this.paymentMethodService.createQueryBuilder('PM').orderBy('id', 'DESC');
    const paginateData = await paginate(res, options);
    const data = {
      items: paginateData.items.map((data) => new PaymentMethodDto(data)),
      meta: paginateData.meta,
    };

    return this.responseOk(data);
  }

  async getNewIdPaymentMethod() {
    const paymentMethod = await this.paymentMethodService
      .createQueryBuilder()
      .withDeleted()
      .orderBy('id', 'DESC')
      .limit(1)
      .getOne();
    let newPaymentMethodId = FIRST_PAYMENT_METHOD_ID;
    if (paymentMethod) {
      let paymentMethodLast = String(paymentMethod.id).slice(1, paymentMethod.id.length);
      newPaymentMethodId = String(Number(paymentMethodLast) + 1).padStart(5, '0');
    }

    return this.responseOk(newPaymentMethodId);
  }

  async create(body: CreatePaymentMethodTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const paymentMethodExist = await this.paymentMethodService.findOne({
      where: {
        id: Equal(body.id),
      },
    });

    if (paymentMethodExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    const checkDuplicateName = await this.paymentMethodService
      .createQueryBuilder('PM')
      .where('PM.name = :name', { name: body.name })
      .getCount();
    let errors = {};
    if (checkDuplicateName > 0) {
      errors['name'] = MSG.DUPLICATE_PAYMENT_METHOD;
      throw new HttpException({ message: errors }, HttpStatus.BAD_REQUEST);
    }
    const dataStaff = this.paymentMethodService.create({
      id: body.id,
      name: body.name,
    });

    try {
      await queryRunner.manager.save(dataStaff);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create staff failed', err);
      throw new HttpException(MSG.PAYMENT_METHOD + MSG.CREATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (Number(id) <= Number(DEFAULT_PAYMENT_METHOD)) {
      throw new HttpException(MSG.STAFF + MSG.DELETE_FAIL, HttpStatus.BAD_REQUEST);
    }
    const checkPaymentBeUse = await this.paymentMethodService
      .createQueryBuilder('PM')
      .leftJoinAndSelect('PM.payment', 'P')
      .leftJoinAndSelect('PM.paymentHistory', 'PH')
      .where('PM.id = :id', { id })
      .getOne();
    if (checkPaymentBeUse.payment.length > 0 || checkPaymentBeUse.paymentHistory.length > 0)
      throw new HttpException(MSG.PAYMENT_METHOD_BE_USE, HttpStatus.BAD_REQUEST);

    try {
      await queryRunner.manager.delete(PaymentMethods, id);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('delete payment method failed', err);
      throw new HttpException(MSG.PAYMENT_METHOD + MSG.DELETE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
