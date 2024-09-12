import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/entities/sale.entity';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { Payment } from 'src/entities/payment.entity';
import { CreatePaymentPlans } from './dto/create-payment-plans.dto';
import { PaymentPlanHistory } from 'src/entities/payment-plan-history.entity';
import { constants } from 'src/constants/constant';
import { UpdatePaymentPlans } from './dto/update-payment-plans.dto';
import { PaymentHistory } from 'src/entities/payment-history.entity';
import {
  GetSaleByCustomerSaleDto,
  GetPaymentPlansByCustomerSaleDto,
  GetPaymentByCustomerSaleDto,
} from './dto/get-plan-by-customer-sale.dto';

@Injectable()
export class PaymentPlanService extends BaseService {
  constructor(
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(PaymentPlan) private paymentPlanRepo: Repository<PaymentPlan>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentHistory) private paymentHistoryRepo: Repository<PaymentHistory>,
    @InjectRepository(PaymentPlanHistory) private paymentPlanHistoryRepo: Repository<PaymentPlanHistory>,
    private dataSource: DataSource,
  ) {
    super();
  }

  async getSale(query: GetSaleByCustomerSaleDto) {
    const sale = this.saleRepo
      .createQueryBuilder('S')
      .select(['S.id', 'S.total', 'S.sub_total'])
      .where('S.customer_id = :customerId', { customerId: query.customerId });

    if (query.saleId) {
      sale.andWhere('S.id != :saleId', { saleId: query.saleId });
    }
    sale.orderBy('S.updated', 'DESC');
    return this.responseOk(await sale.getOne());
  }

  async getPaymentPlansByCustomerSale(query: GetPaymentPlansByCustomerSaleDto) {
    if (!query.saleId) {
      const paymentPlans = await this.getPaymentPlans(query.customerId);
      return this.responseOk(paymentPlans);
    } else {
      const sale = await this.getSale(query);
      const paymentPlansHistory = await this.getPaymentPlansHistory(query.customerId, sale.data?.id);
      return this.responseOk(paymentPlansHistory);
    }
  }

  async getPaymentPlans(customerId: string) {
    const paymentPlans = await this.paymentPlanRepo
      .createQueryBuilder('PP')
      .leftJoinAndSelect('PP.transaction', 'transaction')
      .where('PP.customer_id = :customerId', { customerId: customerId })
      .getMany();
    return this.responseOk(paymentPlans);
  }

  async getPaymentPlansHistory(customerId: string, saleId: string) {
    const paymentPlansHis = await this.paymentPlanHistoryRepo
      .createQueryBuilder('PPH')
      .leftJoinAndSelect('PPH.transaction', 'transaction')
      .where('PPH.customer_id = :customerId', { customerId: customerId })
      .andWhere('PPH.newest_sale_id = :saleId', { saleId: saleId })
      .getMany();
    return this.responseOk(paymentPlansHis);
  }

  async getPaymentByCustomerSale(query: GetPaymentByCustomerSaleDto) {
    if (!query.saleId) {
      const payment = await this.getPayment(query.customerId);
      return this.responseOk(payment);
    } else {
      const paymentHistory = await this.getPaymentHistory(query.customerId);
      return this.responseOk(paymentHistory);
    }
  }

  async getPayment(customerId: string): Promise<Payment> {
    return this.paymentRepo.findOne({
      where: {
        customer_id: customerId,
      },
      order: {
        updated: 'DESC',
      },
    });
  }

  async getPaymentHistory(customerId: string): Promise<PaymentHistory> {
    return this.paymentHistoryRepo.findOne({
      where: {
        customer_id: customerId,
      },
      order: {
        updated: 'DESC',
      },
    });
  }

  async savePaymentPlan(body: CreatePaymentPlans) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { paymentPlans, customerId } = body;

    let paymentPlanHistories = [];

    const paymentPlan = await this.getPaymentPlans(customerId);
    if (paymentPlan.data.length > 0) {
      paymentPlanHistories = this.paymentPlanHistoryRepo.create(paymentPlan.data);
    }

    let paymentPlanNews = [];
    for (let planNew of paymentPlans) {
      paymentPlanNews.push({
        newest_sale_id: planNew.saleId,
        customer_id: planNew.customerId,
        payment_number: planNew.paymentNumber,
        payment_date: planNew.paymentDate,
        payment_amount: planNew.paymentAmount,
        remaining: planNew.remaining,
        status: constants.PAYMENT_STATUS.UN_PAID,
      });
    }

    const paymentPlanNewsCreate = this.paymentPlanRepo.create(paymentPlanNews);
    try {
      if (paymentPlanHistories.length > 0) {
        await queryRunner.manager.save(paymentPlanHistories);
        await this.paymentPlanRepo
          .createQueryBuilder('payment_plans')
          .softDelete()
          .where('customer_id = :customerId', { customerId: body.customerId })
          .execute();
      }
      await queryRunner.manager.save(paymentPlanNewsCreate);

      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      throw new HttpException('Cannot insert this payment plans', constants.STATUS_ERROR.VALUE);
    } finally {
      await queryRunner.release();
    }
  }

  async getPlanNew(saleId) {
    const planNew = await this.paymentPlanRepo.find({
      where: {
        newest_sale_id: saleId,
      },
    });

    if (!planNew) {
      throw new BadRequestException('が見つかりません');
    }
    return planNew;
  }

  async updatePaymentPlan(body: UpdatePaymentPlans) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { paymentPlans } = body;
    let newPlans = [];
    let deletePlans = [];
    let createPlans = [];
    const getPlanCurrent = await this.getPlanNew(body.saleId);

    if (paymentPlans.length >= getPlanCurrent.length) {
      for (let element = 0; element < paymentPlans.length; element++) {
        if (getPlanCurrent[element]?.payment_number == paymentPlans[element].paymentNumber) {
          getPlanCurrent[element].id = getPlanCurrent[element].id;
          getPlanCurrent[element].newest_sale_id = paymentPlans[element].saleId;
          getPlanCurrent[element].customer_id = paymentPlans[element].customerId;
          getPlanCurrent[element].payment_number = paymentPlans[element].paymentNumber;
          getPlanCurrent[element].payment_date = paymentPlans[element].paymentDate;
          getPlanCurrent[element].payment_amount = paymentPlans[element].paymentAmount;
          getPlanCurrent[element].remaining = paymentPlans[element].remaining;
          getPlanCurrent[element].status = constants.PAYMENT_STATUS.UN_PAID;
        } else {
          newPlans.push(paymentPlans[element]);
        }
      }
    } else {
      for (let element = 0; element < getPlanCurrent.length; element++) {
        if (getPlanCurrent[element]?.payment_number == paymentPlans[element]?.paymentNumber) {
          getPlanCurrent[element].id = getPlanCurrent[element].id;
          getPlanCurrent[element].newest_sale_id = paymentPlans[element].saleId;
          getPlanCurrent[element].customer_id = paymentPlans[element].customerId;
          getPlanCurrent[element].payment_number = paymentPlans[element].paymentNumber;
          getPlanCurrent[element].payment_date = paymentPlans[element].paymentDate;
          getPlanCurrent[element].payment_amount = paymentPlans[element].paymentAmount;
          getPlanCurrent[element].remaining = paymentPlans[element].remaining;
          getPlanCurrent[element].status = constants.PAYMENT_STATUS.UN_PAID;
        } else {
          deletePlans.push(getPlanCurrent[element]);
        }
      }
    }

    if (newPlans.length > 0) {
      for (let plan of newPlans) {
        createPlans.push({
          newest_sale_id: plan.saleId,
          customer_id: plan.customerId,
          payment_number: plan.paymentNumber,
          payment_date: plan.paymentDate,
          payment_amount: plan.paymentAmount,
          remaining: plan.remaining,
          status: constants.PAYMENT_STATUS.UN_PAID,
        });
      }
    }

    try {
      const updateDataPlans = this.paymentPlanRepo.create(getPlanCurrent);
      await queryRunner.manager.save(updateDataPlans);

      if (createPlans.length > 0) {
        const planNewData = this.paymentPlanRepo.create(createPlans);
        await queryRunner.manager.save(planNewData);
      }

      if (deletePlans.length > 0) {
        const deletePlansId = deletePlans.map((deletePlans) => deletePlans.id);
        await queryRunner.manager.softDelete(PaymentPlan, deletePlansId);
      }

      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      throw new BadRequestException('Cannot update payment plans');
    } finally {
      await queryRunner.release();
    }
  }
}
