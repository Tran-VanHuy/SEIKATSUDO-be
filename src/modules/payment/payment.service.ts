import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentDto } from './dto/get-payment.dto';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { Sale } from 'src/entities/sale.entity';
import { CreateReceivedTransaction } from './dto/create-payment.dto';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';
import { STATUS_SALE_VALUE, constants } from 'src/constants/constant';
import { UpdateReceivedTransaction } from './dto/update-received-transaction.dto';
import { FindPayment } from './dto/find-payment.dto';
import { Member } from 'src/entities/member.entity';
import { memberType } from 'src/constants/enum';

@Injectable()
export class PaymentService extends BaseService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentPlan) private paymentPlanRepo: Repository<PaymentPlan>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(ReceivedTransaction) private receivedTransactionRepo: Repository<ReceivedTransaction>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    private dataSource: DataSource,
  ) {
    super();
  }

  async getSale(id: string, staffCode: string): Promise<Sale | null> {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) {
      throw new BadRequestException('売上伝票が見つかりません');
    }

    const staff = await this.memberRepo.findOne({
      where: { staffcode: Equal(staffCode) },
    });

    let lastSaleQuery = this.saleRepo
      .createQueryBuilder('S')
      .where('S.customer_id = :customer_id', { customer_id: sale.customer_id });

    if (staff.authority === memberType.NORMAL) {
      lastSaleQuery = lastSaleQuery.andWhere('S.staff_id = :staff_id', { staff_id: staff.id });
    }

    const lastSale = await lastSaleQuery.orderBy('created', 'DESC').getOne();

    if (!lastSale) {
      throw new BadRequestException('一般担当者ですので他の担当者の売上伝票を入金できません');
    }

    if (id !== lastSale.id) {
      throw new BadRequestException('顧客の最新売上伝票を入力してください');
    }

    return lastSale;
  }

  async getPaymentByCustomerSale(body: PaymentDto): Promise<Payment> {
    return this.paymentRepo.findOne({
      where: {
        newest_sale_id: body.saleId,
        customer_id: body.customerId,
      },
    });
  }

  async getPaymentPlansByCustomerSale(body: PaymentDto): Promise<PaymentPlan[]> {
    return this.paymentPlanRepo.find({
      where: {
        newest_sale_id: body.saleId,
        customer_id: body.customerId,
      },
      order: {
        payment_number: 'ASC',
      },
    });
  }

  async getReceivedTransactionsByCustomerSale(body: PaymentDto): Promise<ReceivedTransaction[]> {
    return this.receivedTransactionRepo.find({
      where: {
        newest_sale_id: body.saleId,
        customer_id: body.customerId,
      },
      order: {
        payment_number: 'ASC',
      },
    });
  }

  async saveReceivedTransaction(body: CreateReceivedTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { saleId, customerId, paymentPlanId, paymentNumber, paymentDate, paymentAmount, paymentType, remaining } =
      body;
    const paymentPlan = { status: constants.PAYMENT_STATUS.PAID };
    const data = this.receivedTransactionRepo.create({
      newest_sale_id: saleId,
      customer_id: customerId,
      payment_plan_id: paymentPlanId,
      payment_number: paymentNumber,
      payment_date: paymentDate,
      payment_amount: paymentAmount,
      payment_type: paymentType,
      remaining: remaining,
    });
    const dataSale = {};
    if (remaining <= 0) {
      dataSale['status'] = STATUS_SALE_VALUE.PAYMENT_DONE;
    }

    try {
      await queryRunner.manager.update(PaymentPlan, paymentPlanId, paymentPlan);
      await queryRunner.manager.save(data);

      if (remaining <= 0) {
        await queryRunner.manager.update(Sale, saleId, dataSale);
      }
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create receive transaction failed', err);
      throw new HttpException('create receive transaction', HttpStatus.BAD_GATEWAY);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllSalesByCustomer(customerId: string): Promise<Sale[]> {
    const sales = await this.saleRepo.find({
      where: {
        customer_id: customerId,
      },
      order: {
        updated: 'DESC',
      },
      take: constants.SALE.TAKE_THREE,
    });
    return sales.reverse();
  }

  async getlistPayment(query: FindPayment) {
    const queryTwo = await this.dataSource
      .createQueryBuilder()
      .select('received_transactions.newest_sale_id, MAX(received_transactions.updated) as "up"')
      .from(ReceivedTransaction, 'received_transactions')
      .groupBy('received_transactions.newest_sale_id');

    let sale = this.paymentRepo
      .createQueryBuilder('PM')
      .leftJoinAndSelect('PM.sale', 'S')
      .leftJoinAndSelect('PM.customer', 'C')
      .innerJoinAndSelect(
        (qb) =>
          qb
            .select('RT.*')
            .from(ReceivedTransaction, 'RT')
            .innerJoin(
              '(' + queryTwo.getQuery() + ')',
              'max_tranc',
              'max_tranc.newest_sale_id = RT.newest_sale_id AND max_tranc.up = RT.updated',
            ),
        'RTS',
        '`RTS`.`newest_sale_id` = PM.newest_sale_id',
      );

    if (query.startDate) {
      sale.andWhere('payment_date >= :startDate', { startDate: query.startDate });
    }
    if (query.endDate) {
      sale.andWhere('payment_date <= :endDate', { endDate: query.endDate });
    }
    if (query.startAmount) {
      sale.andWhere(`payment_amount >= ${query.startAmount}`);
    }
    if (query.endAmount) {
      sale.andWhere('payment_amount <= :endAmount', { endAmount: query.endAmount });
    }
    if (query.paymentType && query.paymentType != constants.PAYMENT_TYPE.GET_ALL) {
      sale.andWhere(`RTS.payment_type = ${query.paymentType}`);
    }

    let cloned = sale;
    let count = await cloned.getCount();
    const listSale = await sale
      .limit(Number(query.rowsPerPage))
      .offset(Number(query.currentPage) * Number(query.rowsPerPage) - Number(query.rowsPerPage))
      .getRawMany();

    const response = listSale.map((item) => {
      return {
        staffId: item.S_staff_id,
        status: item.S_status,
        transactionId: item.id,
        saleId: item.PM_newest_sale_id,
        customerId: item.PM_customer_id,
        customerName: item.C_name,
        subTotal: item.PM_total - item.PM_fee,
        paymentDate: item.payment_date,
        paymentAmount: item.payment_amount,
        remaining: item.remaining,
        paymentType: item.payment_type,
        checkPlanNumber: item.PM_payment_plan_number == item.payment_number,
      };
    });

    const data = {
      items: response,
      meta: {
        totalItems: count,
        itemCount: 1,
        itemsPerPage: Number(query.rowsPerPage),
        totalPages: Math.ceil(count / Number(query.rowsPerPage)),
        currentPage: Number(query.currentPage),
      },
    };
    return this.responseOk(data);
  }

  async updateTransaction(body: UpdateReceivedTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const receivedTransaction = await this.receivedTransactionRepo.findOne({
      where: {
        id: body.transactionId,
      },
    });

    if (!receivedTransaction) {
      throw new BadRequestException('Received transaction is not found');
    }

    const { saleId, customerId, paymentPlanId, paymentNumber, paymentDate, paymentAmount, paymentType, remaining } =
      body;

    (receivedTransaction.newest_sale_id = saleId),
      (receivedTransaction.customer_id = customerId),
      (receivedTransaction.payment_plan_id = paymentPlanId),
      (receivedTransaction.payment_number = paymentNumber),
      (receivedTransaction.payment_date = paymentDate),
      (receivedTransaction.payment_amount = paymentAmount),
      (receivedTransaction.payment_type = paymentType),
      (receivedTransaction.remaining = remaining);

    try {
      const transactionData = this.receivedTransactionRepo.create(receivedTransaction);
      await queryRunner.manager.save(transactionData);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      throw new BadRequestException('Cannot update received transaction');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteReceivedTransaction(transactionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softDelete(ReceivedTransaction, {
        id: transactionId,
      });
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(err);
      throw new BadRequestException('Cannot delete received transaction');
    } finally {
      await queryRunner.release();
    }
  }

  async getNextPaymentPlanByCustomer(customerId: string, orderDate: Date): Promise<PaymentPlan> {
    try {
      const data = await this.paymentPlanRepo
        .createQueryBuilder('payment_plans')
        .where('payment_plans.customer_id = :customerId', { customerId: customerId })
        .andWhere('payment_plans.payment_date > :orderDate', { orderDate: orderDate })
        .orderBy('payment_plans.payment_date', 'ASC')
        .getOne();

      const resData = {
        paymentLimit: data?.payment_date || null,
        remaining: data?.remaining || 0,
        paymentPlan: data?.payment_amount || 0,
      };
      return this.responseOk(resData);
    } catch (err) {
      this.logger.debug('get next payment plan by customer failed', err);
      throw new BadRequestException('Get next payment plan by customer failed');
    }
  }

  async getTransactionById(transactionId: number) {
    const transaction = await this.receivedTransactionRepo.findOne({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new BadRequestException('Received Transaction not found');
    }
    return transaction;
  }
}
