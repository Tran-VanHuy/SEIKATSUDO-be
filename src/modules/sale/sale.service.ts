import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { Sale } from 'src/entities/sale.entity';
import { SaleProduct } from 'src/entities/sale-product.entity';
import { CreateSaleTransaction } from 'src/modules/sale/dto/request.dto/create.dto';
import { Shipment } from 'src/entities/shipment.entity';
import { Payment } from 'src/entities/payment.entity';
import { PaymentHistory } from 'src/entities/payment-history.entity';
import { HttpService } from '@nestjs/axios';
import {
  FIRST_PAYMENT,
  MSG,
  STATUS_OPTION,
  STATUS_SALE_VALUE,
  TRANSFER,
  firstRevenueId,
  SHIPMENT_TIME_OPTION,
} from 'src/constants/constant';
import { ZipCodeResDto } from './dto/response.dto/zip-code.res.dto';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ReqSaleTransactionDto } from './dto/request.dto/req.list.dto';
import { ResListSaleDto } from './dto/response.dto/res.list.dto';
import { PaymentResDto } from './dto/response.dto/res.payment.dto';
import { ShipmentResDto } from './dto/response.dto/res.shipment.dto';
import { ProductResDto } from './dto/response.dto/res.product.dto';
import { UpdateMultiTransaction } from './dto/request.dto/update.multi.dto';
import { Product } from 'src/entities/product.entity';
import { StreamableFile } from '@nestjs/common';
import { delay } from 'src/helpers/UtilsHelper';
import * as fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { Member } from 'src/entities/member.entity';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { PaymentMethods } from 'src/entities/payment-method.entity';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SaleService extends BaseService {
  constructor(
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleProduct) private readonly saleProductRepo: Repository<SaleProduct>,
    @InjectRepository(Shipment) private readonly shipmentsRepo: Repository<Shipment>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentHistory) private readonly paymentHistoryRepo: Repository<PaymentHistory>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
    @InjectRepository(PaymentPlan) private readonly paymentPlanRepo: Repository<PaymentPlan>,
    @InjectRepository(PaymentMethods) private readonly paymentMethodRepo: Repository<PaymentMethods>,
    @InjectRepository(ReceivedTransaction) private readonly receivedTransactionRepo: Repository<ReceivedTransaction>,
    private dataSource: DataSource,
    private httpService: HttpService,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async findAll(query: ReqSaleTransactionDto) {
    try {
      let data = this.saleRepo
        .createQueryBuilder('S')
        .leftJoinAndSelect('S.payment', 'P')
        .leftJoinAndSelect('S.paymentHistories', 'PH')
        .leftJoinAndSelect('S.receives', 'R')
        .leftJoinAndSelect('S.memberConfirmStaff', 'MCS')
        .leftJoinAndSelect('S.memberShipmentStaff', 'MS')
        .leftJoinAndSelect('S.staff', 'ST');
      if (query.id) {
        data.andWhere('S.id = :id', { id: query.id });
      }
      if (query.customerName) {
        data.andWhere('S.customer_name = :customerName', { customerName: query.customerName });
      }
      if (query.shippingCompanyId) {
        data.andWhere('S.shipping_company_id = :shippingCompanyId', { shippingCompanyId: query.shippingCompanyId });
      }
      if (query.paymentType) {
        data.andWhere('P.payment_type = :paymentType', { paymentType: query.paymentType });
      }
      if (query.shippingType) {
        data.andWhere('S.shipping_type = :shippingType', { shippingType: query.shippingType });
      }
      if (query.status) {
        data.andWhere('S.status = :status', { status: query.status });
      }
      if (query.statusChangeReason) {
        data.andWhere('S.status_change_reason = :statusChangeReason', { statusChangeReason: query.statusChangeReason });
      }
      if (query.shippingConfirmStaffId) {
        data.andWhere('S.shipping_confirm_staff_id = :shippingConfirmStaffId', {
          shippingConfirmStaffId: query.shippingConfirmStaffId,
        });
      }
      if (query.shipmentStaffId) {
        data.andWhere('S.shipment_staff_id = :shipmentStaffId', { shipmentStaffId: query.shipmentStaffId });
      }
      if (query.fromDateOrder) {
        data.andWhere('S.order_date >= :fromDateOrder', { fromDateOrder: query.fromDateOrder });
      }
      if (query.toDateOrder) {
        data.andWhere('S.order_date <= :toDateOrder', { toDateOrder: query.toDateOrder });
      }
      if (query.fromDateShipping) {
        data.andWhere('S.shipping_date >= :fromDateShipping', { fromDateShipping: query.fromDateShipping });
      }
      if (query.toDateShipping) {
        data.andWhere('S.shipping_date <= :toDateShipping', { toDateShipping: query.toDateShipping });
      }
      if (query.fromDayShipping) {
        data.andWhere('S.day_shipping >= :fromDayShipping', { fromDayShipping: query.fromDayShipping });
      }
      if (query.toDayShipping) {
        data.andWhere('S.day_shipping <= :toDayShipping', { toDayShipping: query.toDayShipping });
      }
      data.orderBy('S.id', 'DESC');

      const paginateData = await this.customPaginate<Sale>(
        data,
        Number(query.rowsPerPage),
        Number(query.currentPage),
      );
      const salePaginate = {
        items: paginateData.items,
        meta: paginateData.meta,
      };

      return this.responseOk(salePaginate);
    } catch (err) {
      this.logger.debug('search sale failed', err);
      throw new HttpException(MSG.SALE + MSG.SEARCH_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async createSale(body: CreateSaleTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { sale, products, shipment, payment } = body;

    const dataSale = this.saleRepo.create({
      id: sale.saleId,
      customer_id: sale.customerId,
      customer_name: sale.customerName,
      staff_id: sale.staffId,
      shipping_date: sale.shippingDate,
      shipping_check: sale.shippingCheck,
      order_date: sale.orderDate,
      shipping_confirm_staff_id: sale.shippingConfirmStaffId === '' ? null : sale.shippingConfirmStaffId,
      shipment_staff_id: sale.shipmentStaffId === '' ? null : sale.shipmentStaffId,
      shipping_company_id: sale.shippingCompanyId,
      shipping_company_name: sale.shippingCompanyName,
      status: sale.status,
      status_change_reason: sale.statusChangeReason,
      sub_total: sale.subTotal,
      shipping_fee: payment.shippingFee,
      shipping_origin_id: sale.shippingOriginId,
      discount: payment.discount,
      total: sale.total,
      shipping_type: sale.shippingType,
      day_shipping: sale.dayShipping ?? null,
    });

    let dataSaleProduct = [];
    let productIds = [];
    for (let product of products) {
      dataSaleProduct.push({
        sale_id: dataSale.id,
        sort: product.sort,
        type: product.type,
        product_id: product.id,
        amount: product.amount,
        unit: product.unit,
        unit_price: product.unitPrice,
        subtotal: product.subtotal,
        subtax: product.subTax,
        shipment_amount: product.amount,
      });
      productIds.push(product.id);
    }
    const productIsDisable = await this.checkProduct(productIds);
    if (productIsDisable.length > 0)
      throw new HttpException(productIsDisable + MSG.PRODUCT_IS_DISABLE, HttpStatus.BAD_REQUEST);
    const dataSaleProductCreate = this.saleProductRepo.create(dataSaleProduct);

    const dataShipment = this.shipmentsRepo.create({
      sale_id: dataSale.id,
      delivery_date: shipment.deliveryDate,
      delivery_time: shipment.deliveryTime,
      delivery_tel: shipment.deliveryTel,
      customer_address_id: shipment.customerAddressId,
      delivery_name: shipment.deliveryName,
      delivery_zip: shipment.deliveryZip,
      delivery_address1: shipment.deliveryAddress1,
      delivery_address2: shipment.deliveryAddress2,
      delivery_address3: shipment.deliveryAddress3,
      shipping_note: shipment.shippingNote,
      customer_memo: shipment.customerMemo,
    });

    const dataPayment = this.paymentRepo.create({
      newest_sale_id: sale.saleId,
      customer_id: sale.customerId,
      sub_total: payment.subTotal,
      fee: payment.fee,
      total: payment.total,
      deposit: payment.deposit,
      remaining: payment.remaining,
      payment_plan_number: payment.paymentPlanNumber,
      payment_limit: payment.paymentLimit ?? null,
      payment_type: sale.paymentType,
    });

    const paymentDelete = await this.paymentRepo
      .createQueryBuilder()
      .where('customer_id = :customerId', { customerId: sale.customerId })
      .getOne();
    let dataPaymentHistory = {};
    if (paymentDelete) {
      dataPaymentHistory = this.paymentHistoryRepo.create({
        newest_sale_id: paymentDelete.newest_sale_id,
        customer_id: paymentDelete.customer_id,
        sub_total: paymentDelete.sub_total,
        fee: paymentDelete.fee,
        total: paymentDelete.total,
        deposit: paymentDelete.deposit,
        remaining: paymentDelete.remaining,
        payment_plan_number: paymentDelete.payment_plan_number,
        payment_type: paymentDelete.payment_type,
        payment_limit: paymentDelete.payment_limit,
      });
    }

    const saleExist = await this.saleRepo.findOne({
      where: {
        id: Equal(sale.saleId),
      },
    });

    if (saleExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      await queryRunner.manager.save(dataSale);
      await queryRunner.manager.save(dataSaleProductCreate);
      await queryRunner.manager.save(dataShipment);
      if (paymentDelete) {
        await queryRunner.manager.delete(Payment, paymentDelete.id);
        await queryRunner.manager.save(dataPaymentHistory);
      }
      await queryRunner.manager.save(dataPayment);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create sale failed', err);
      throw new HttpException(MSG.SALE + MSG.CREATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async findAddressByZip(zipCode: string): Promise<ZipCodeResDto[]> {
    let data = await this.httpService.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`).toPromise();
    return this.responseOk(data.data.results);
  }

  async getNewSaleId() {
    const sale = await this.saleRepo.createQueryBuilder('S').withDeleted().orderBy('created', 'DESC').limit(1).getOne();
    let newId = firstRevenueId;
    if (sale) {
      let revenueIdFirst = String(sale.id).slice(0, 1);
      let revenueIdLast = String(sale.id).slice(1, sale.id.length);
      newId = revenueIdFirst + String(Number(revenueIdLast) + 1).padStart(16, '0');
    }

    return this.responseOk(newId);
  }

  async delete(saleId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const paymentDelete = await this.paymentRepo
      .createQueryBuilder()
      .where('newest_sale_id = :saleId', { saleId: saleId })
      .getOne();
    const paymentHistoryDelete = await this.paymentHistoryRepo
      .createQueryBuilder()
      .where('newest_sale_id = :saleId', { saleId: saleId })
      .getOne();
    const shipmentDelete = await this.shipmentsRepo
      .createQueryBuilder()
      .where('sale_id = :saleId', { saleId: saleId })
      .getOne();
    const saleProductDelete = await this.saleProductRepo
      .createQueryBuilder('SP')
      .where('sale_id = :saleId', { saleId: saleId })
      .getMany();
    try {
      await queryRunner.manager.softDelete(Sale, saleId);
      if (paymentDelete) await queryRunner.manager.softDelete(Payment, paymentDelete.id);
      if (paymentHistoryDelete) await queryRunner.manager.softDelete(PaymentHistory, paymentHistoryDelete.id);
      if (shipmentDelete) await queryRunner.manager.softDelete(Shipment, shipmentDelete.id);
      if (saleProductDelete.length > 0) {
        await Promise.all(
          saleProductDelete.map(async (saleProduct) => {
            return queryRunner.manager.delete(SaleProduct, {
              sale_id: saleProduct.sale_id,
              sort: saleProduct.sort,
              product_id: saleProduct.product_id,
            });
          }),
        );
      }
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('delete sale failed', err);
      throw new HttpException(MSG.SALE + MSG.DELETE_FAIL, HttpStatus.BAD_GATEWAY);
    } finally {
      await queryRunner.release();
    }
  }

  async getSaleById(saleId: string) {
    try {
      const saleData = await this.saleRepo
        .createQueryBuilder('S')
        .leftJoinAndSelect('S.shipment', 'SM')
        .leftJoinAndSelect('S.payment', 'P')
        .leftJoinAndSelect('S.paymentHistories', 'PH')
        .leftJoinAndSelect('S.receives', 'R')
        .leftJoinAndSelect('S.memberConfirmStaff', 'MCS')
        .leftJoinAndSelect('S.memberShipmentStaff', 'MS')
        .leftJoinAndSelect('S.staff', 'ST')
        .andWhere('S.id = :saleId', { saleId: saleId })
        .getOne();
      const saleResponse = new ResListSaleDto(saleData);
      const paymentResponse = new PaymentResDto(saleData);
      const shipmentResponse = new ShipmentResDto(saleData);

      const productData = await this.saleProductRepo
        .createQueryBuilder('SP')
        .leftJoinAndSelect('SP.product', 'SPP')
        .andWhere('SP.sale_id = :saleId', { saleId: saleId })
        .orderBy('SP.sort', 'ASC')
        .getMany();
      const productsResponse = productData.map((data) => new ProductResDto(data));

      return this.responseOk({
        sale: saleResponse,
        payment: paymentResponse,
        products: productsResponse,
        shipment: shipmentResponse,
      });
    } catch (err) {
      this.logger.debug('get sale detail failed', err);
      throw new HttpException(MSG.SALE + MSG.GET_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSale(body: CreateSaleTransaction, saleId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { sale, products, shipment, payment } = body;
    let saleReceives = await this.saleRepo
      .createQueryBuilder('S')
      .leftJoinAndSelect('S.receives', 'R')
      .where('S.id = :saleId', { saleId: saleId })
      .getOne();
    if (saleReceives.receives.length > 0 && sale.status === STATUS_SALE_VALUE.CANCEL) {
      throw new HttpException(MSG.SALE_CAN_NOT_CANCEL, HttpStatus.BAD_REQUEST);
    }
    if (
      [
        STATUS_SALE_VALUE.CANCEL,
        STATUS_SALE_VALUE.PAYMENT_DONE,
        STATUS_SALE_VALUE.SHIPPING_PREPARE,
        STATUS_SALE_VALUE.REMOVE_PAYMENT,
      ].includes(saleReceives.status)
    ) {
      const status = STATUS_OPTION.find((item) => item.value === sale.status)?.label;
      throw new HttpException(MSG.SALE_HAVE + status + MSG.BE_CHANGE, HttpStatus.BAD_REQUEST);
    }

    const dataSale = {
      customer_id: sale.customerId,
      customer_name: sale.customerName,
      staff_id: sale.staffId,
      shipping_date: sale.shippingDate,
      shipping_check: sale.shippingCheck,
      order_date: sale.orderDate,
      shipping_confirm_staff_id: sale.shippingConfirmStaffId,
      shipment_staff_id: sale.shipmentStaffId === '' ? null : sale.shipmentStaffId,
      shipping_company_id: sale.shippingCompanyId,
      shipping_company_name: sale.shippingCompanyName,
      status: sale.status,
      status_change_reason: sale.statusChangeReason,
      sub_total: sale.subTotal,
      shipping_fee: payment.shippingFee,
      shipping_origin_id: sale.shippingOriginId,
      discount: payment.discount,
      total: sale.total,
      shipping_type: sale.shippingType,
      day_shipping: sale.dayShipping ?? null,
    };

    const dataShipment = {
      sale_id: saleId,
      delivery_date: shipment.deliveryDate,
      delivery_time: shipment.deliveryTime,
      delivery_tel: shipment.deliveryTel,
      customer_address_id: shipment.customerAddressId,
      delivery_name: shipment.deliveryName,
      delivery_zip: shipment.deliveryZip,
      delivery_address1: shipment.deliveryAddress1,
      delivery_address2: shipment.deliveryAddress2,
      delivery_address3: shipment.deliveryAddress3,
      shipping_note: shipment.shippingNote,
      customer_memo: shipment.customerMemo,
    };

    const dataPayment = {
      newest_sale_id: saleId,
      customer_id: sale.customerId,
      sub_total: payment.subTotal,
      fee: payment.fee,
      total: payment.total,
      deposit: payment.deposit,
      remaining: payment.remaining,
      payment_plan_number: payment.paymentPlanNumber,
      payment_limit: payment.paymentLimit,
      payment_type: sale.paymentType,
    };

    const saleProductDelete = await this.saleProductRepo
      .createQueryBuilder('SP')
      .where('sale_id = :saleId', { saleId: saleId })
      .getMany();
    let dataSaleProduct = [];
    let productIds = [];
    for (let product of products) {
      dataSaleProduct.push({
        sale_id: saleId,
        sort: product.sort,
        type: product.type,
        product_id: product.id,
        amount: product.amount,
        unit: product.unit,
        unit_price: product.unitPrice,
        subtotal: product.subtotal,
        subtax: product.subTax,
        shipment_amount: product.amount,
      });
      productIds.push(product.id);
    }
    const productIsDisable = await this.checkProduct(productIds);
    if (productIsDisable.length > 0)
      throw new HttpException(productIsDisable + MSG.PRODUCT_IS_DISABLE, HttpStatus.BAD_REQUEST);
    const dataSaleProductCreate = this.saleProductRepo.create(dataSaleProduct);

    try {
      await queryRunner.manager.update(Sale, saleId, dataSale);
      if (shipment) await queryRunner.manager.update(Shipment, shipment.shipmentId, dataShipment);
      if (payment) await queryRunner.manager.update(Payment, payment.paymentId, dataPayment);
      if (saleProductDelete.length > 0) {
        await Promise.all(
          saleProductDelete.map(async (saleProduct) => {
            return queryRunner.manager.delete(SaleProduct, {
              sale_id: saleProduct.sale_id,
              sort: saleProduct.sort,
              product_id: saleProduct.product_id,
            });
          }),
        );
      }
      await queryRunner.manager.save(dataSaleProductCreate);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('update sale failed', err);
      throw new HttpException(MSG.SALE + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async updateMultiSale(body: UpdateMultiTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { saleSelected } = body;
    let saleNotOrderConfirm = '';
    saleSelected.forEach((sale) => {
      if (sale.status !== STATUS_SALE_VALUE.ORDER_CONFIRMED) {
        saleNotOrderConfirm = saleNotOrderConfirm + (saleNotOrderConfirm.length > 0 ? '、' : '') + sale.saleId;
      }
    });
    if (saleNotOrderConfirm.length > 0)
      throw new HttpException(saleNotOrderConfirm + MSG.SALE_IS_NOT_ORDER_CONFIRMED_STATUS, HttpStatus.BAD_REQUEST);

    try {
      await Promise.all(
        saleSelected.map(async (sale) => {
          return queryRunner.manager.update(Sale, sale.saleId, {
            id: sale.saleId,
            shipment_staff_id: sale.shipmentStaffId,
            day_shipping: sale.dayShipping,
            status: STATUS_SALE_VALUE.SHIPPING_PREPARE,
          });
        }),
      );
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('update sale failed', err);
      throw new HttpException(MSG.SALE + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async csv(body: UpdateMultiTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { saleSelected } = body;
    let saleNotShippingPrepare = '';
    saleSelected.forEach((sale) => {
      if (sale.status !== STATUS_SALE_VALUE.SHIPPING_PREPARE) {
        saleNotShippingPrepare = saleNotShippingPrepare + (saleNotShippingPrepare.length > 0 ? '、' : '') + sale.saleId;
      }
    });
    if (saleNotShippingPrepare.length > 0)
      throw new HttpException(saleNotShippingPrepare + MSG.SALE_IS_NOT_SHIPPING_PREPARE_STATUS, HttpStatus.BAD_REQUEST);

    try {
      await Promise.all(
        saleSelected.map(async (sale) => {
          return queryRunner.manager.update(Sale, sale.saleId, {
            id: sale.saleId,
            status: STATUS_SALE_VALUE.SHIPPED,
          });
        }),
      );
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('export csv sale failed', err);
      throw new HttpException(MSG.SALE + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async print(body: UpdateMultiTransaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { saleSelected } = body;
    let saleNotShipped = '';
    saleSelected.forEach((sale) => {
      if (sale.status !== STATUS_SALE_VALUE.SHIPPED && sale.status !== STATUS_SALE_VALUE.SHIPPING_PREPARE) {
        saleNotShipped = saleNotShipped + (saleNotShipped.length > 0 ? '、' : '') + sale.saleId;
      }
    });
    if (saleNotShipped.length > 0)
      throw new HttpException(saleNotShipped + MSG.SALE_IS_NOT_SHIPPED_STATUS, HttpStatus.BAD_REQUEST);

    try {
      await Promise.all(
        saleSelected.map(async (sale) => {
          return queryRunner.manager.update(Sale, sale.saleId, {
            id: sale.saleId,
            status: sale.status === STATUS_SALE_VALUE.SHIPPING_PREPARE ? STATUS_SALE_VALUE.SHIPPED : sale.status,
          });
        }),
      );
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('export csv sale failed', err);
      throw new HttpException(MSG.SALE + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async getPayment(saleId: string) {
    return this.paymentRepo.findOne({
      where: {
        newest_sale_id: Equal(saleId),
      },
    });
  }

  async checkProduct(productIds: Array<number>) {
    const productData = await this.productRepo
      .createQueryBuilder('P')
      .whereInIds(productIds)
      .andWhere('P.is_disabled = 0')
      .getMany();
    let productIsDisable = '';
    productData.forEach((product) => {
      productIsDisable = productIsDisable + (productIsDisable.length > 0 ? '、' : '') + product.id;
    });
    return productIsDisable;
  }

  async getSalePDF(saleId: string) {
    const { saleResponse, shipmentResponse, productsResponse, firstPaymentPlan, subTax } =
      await this.getSaleInfoForExport(saleId);

    const payment = await this.getPayment(saleId);

    const consumptionTax = taxCalculation(subTax, saleResponse.shippingFee, payment.fee);

    const fonts = {
      Roboto: {
        normal: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        bold: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        italics: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        bolditalics: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
      },
      CenturyGothic: {
        normal: path.join(__dirname, '../..', 'public', '/fonts/CenturyGothic.ttf'),
      },
    };

    const { createCanvas } = require('canvas');
    const JsBarcode = require('jsbarcode');
    const PdfPrinter = require('pdfmake');
    const printer = new PdfPrinter(fonts);
    const canvas = createCanvas();
    JsBarcode(
      canvas,
      formatSaleBarCode(saleResponse.saleId, saleResponse.customerId, String(firstPaymentPlan.payment_amount)),
    );
    const _ = require('lodash');
    let docDefinition = {
      content: [],
      styles: {
        subtitle: {
          margin: [200, 115, 0, 0],
        },
        header: {
          margin: [0, 5, 0, 15],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
        textLeft: {
          alignment: 'left',
        },
        textRight: {
          alignment: 'right',
        },
      },
      pageMargins: [40, 35, 18, 0],
      defaultStyle: {
        fontSize: 9,
      },
    };
    const tableContent = [
      {
        text: 'お買い上げ明細書\n\n',
        fontSize: 18,
        style: 'header',
        alignment: 'center',
        decoration: 'underline',
      },
      {
        text: '株式会社晴活堂',
        fontSize: 18,
        alignment: 'right',
        margin: [0, 0, 40, 0],
      },
      {
        alignment: 'justify',
        columns: [
          {
            text: saleResponse.customerName + ' 様',
            alignment: 'left',
            margin: [0, 10, 0, 0],
          },
          {
            text: '〒810-0042 福岡県福岡市中央区赤坂1-14-22',
            alignment: 'right',
            margin: [0, 10, 0, 0],
          },
        ],
      },
      {
        text: 'TEL 092-720-3633',
        alignment: 'right',
      },
      {
        text: 'フリーダイヤル 0120-12-12-98',
        alignment: 'right',
      },
      {
        alignment: 'justify',
        columns: [
          {
            alignment: 'left',
            width: '70%',
            text: [
              {
                text:
                  '担当        ' +
                  saleResponse.staffName +
                  '              ご注文日 ' +
                  dayjs(saleResponse.orderDate).format('YYYY-MM-DD') +
                  '\n',
              },
              {
                text: '\nご注文ありがとうございます。下記の通り商品申し上げます。\n\n',
              },
            ],
          },
          {
            width: '30%',
            alignment: 'right',
            margin: [45, 5, 0, 5],
            columns: [
              {
                table: {
                  body: [
                    ['お届け日', '伝票番号'],
                    [
                      dayjs(shipmentResponse.deliveryDate).format('YYYY-MM-DD'),
                      saleResponse.saleId.slice(saleResponse.saleId.length - 8, saleResponse.saleId.length),
                    ],
                  ],
                },
                alignment: 'center',
              },
            ],
          },
        ],
      },
      {
        style: 'tableExample',
        table: {
          widths: [200, '*', '*', '*', 100],
          body: [['品名', '数 量', '単 価', '金 額', '要要']],
        },
      },
      {
        alignment: 'right',
        columns: [
          {
            text: '通信欄',
            width: '70%',
            alignment: 'left',
            margin: [10, 10, 0, 0],
          },
          {
            alignment: 'right',
            margin: [0, 5, 0, 5],
            columns: [
              {
                table: {
                  widths: [76, 66],
                  body: [
                    [
                      '今回ご請求金額',
                      {
                        text: '¥' + formatMoney(firstPaymentPlan.payment_amount),
                        style: 'textRight',
                        font: 'CenturyGothic',
                      },
                    ],
                  ],
                },
                alignment: 'center',
              },
            ],
          },
        ],
      },
      {
        style: 'tableExample',
        margin: [0, 0, 0, 10],
        table: {
          widths: [352, 167],
          body: [
            [
              {
                rowSpan: 3,
                text: '当社商品は、軽減税率対象となります。\n' + shipmentResponse.shippingNote + '\n\n\n\n',
              },
              { rowSpan: 3, text: '' },
            ],
            ['', ''],
            ['', ''],
          ],
        },
        alignment: 'left',
      },
    ];
    const barCodeContent = [
      {
        text: '\n\n\n',
        alignment: 'right',
      },
      {
        columns: [
          {
            width: '60%',
            text: formatMoneyToString(firstPaymentPlan.payment_amount),
            alignment: 'right',
            margin: [0, 14, 17, 0],
          },
          {
            width: '40%',
            text: '',
            alignment: 'right',
          },
        ],
        columnGap: 10,
      },
      {
        columns: [
          {
            width: '60%',
            text: '',
            alignment: 'right',
            margin: [0, 15, 0, 0],
          },
          {
            width: '40%',
            text: saleResponse.customerName + ' 様',
            alignment: 'right',
            margin: [0, 10, 0, 0],
          },
        ],
        columnGap: 10,
      },
      {
        text: '\n\n\n',
        alignment: 'right',
      },
      {
        columns: [
          {
            width: '100%',
            text: saleResponse.customerId,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
        ],
        columnGap: 10,
      },
      {
        text: '\n',
        alignment: 'right',
      },
      {
        columns: [
          {
            width: '85%',
            text: '9000' + saleResponse.saleId.slice(saleResponse.saleId.length - 8, saleResponse.saleId.length),
            fontSize: 11,
            alignment: 'left',
            bold: true,
            margin: [10, 0, 0, 0],
          },
          {
            width: '15%',
            text: saleResponse.saleId.slice(saleResponse.saleId.length - 8, saleResponse.saleId.length),
            alignment: 'right',
          },
        ],
        columnGap: 10,
      },
      {
        text: '\n',
        alignment: 'right',
      },
      {
        columns: [
          {
            width: '87%',
            text: formatMoneyToString(firstPaymentPlan.payment_amount),
            alignment: 'right',
          },

          {
            width: '13%',
            text: firstPaymentPlan.payment_amount,
            alignment: 'right',
          },
        ],
        columnGap: 10,
      },
      {
        columns: [
          {
            width: '60%',
            text:
              '\n〒' +
              shipmentResponse.deliveryZip +
              ' ' +
              shipmentResponse.deliveryAddress1 +
              shipmentResponse.deliveryAddress2 +
              shipmentResponse.deliveryAddress3,
            alignment: 'left',
            margin: [0, 5, 0, 0],
          },
          {
            width: '40%',

            text: '',
            alignment: 'left',
          },
        ],
      },
      {
        columns: [
          {
            width: '60%',
            text: saleResponse.customerName + ' 様',
            alignment: 'left',
            margin: [0, 5, 0, 0],
          },
          {
            width: '25%',
            text: saleResponse.saleId.slice(saleResponse.saleId.length - 8, saleResponse.saleId.length),
            alignment: 'center',
            margin: [18, 5, 0, 0],
          },
          {
            width: '15%',
            margin: [0, -7, 0, 0],
            text: saleResponse.total,
            alignment: 'right',
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            fit: [200, 150],
            image: canvas.toDataURL(),
            margin: [2, 3, 0, 0],
          },
          {
            width: '10%',
            text: '',
          },
          {
            width: '25%',
            text: saleResponse.customerName + ' 様',
            alignment: 'center',
            fontSize: 12,
            margin: [18, 10, 0, 0],
          },
          {
            width: '15%',
            fontSize: 11,
            text: '',
            alignment: 'left',
          },
        ],
      },
      {
        margin: [116, 8, 0, 0],
        text:
          '\n' +
          dayjs(firstPaymentPlan.payment_date).format('YYYY') +
          '    ' +
          dayjs(firstPaymentPlan.payment_date).format('MM') +
          '      ' +
          dayjs(firstPaymentPlan.payment_date).format('DD'),
        alignment: 'left',
      },
    ];
    const lastTableContent = [
      [
        { text: '値引', style: 'textLeft' },
        '',
        '',
        { text: '-' + formatMoney(saleResponse.discount), style: 'textRight' },
        '',
      ],
      [
        { text: '送料', style: 'textLeft' },
        '',
        '',
        { text: formatMoney(saleResponse.shippingFee), style: 'textRight' },
        '',
      ],
      [{ text: '小計', style: 'textLeft' }, '', '', { text: formatMoney(saleResponse.total), style: 'textRight' }, ''],
      [{ text: '内消費税', style: 'textLeft' }, '', '', { text: formatMoney(consumptionTax), style: 'textRight' }, ''],
    ];
    const MAX_RECORD_TABLE_PER_PAGE = 17;

    if (productsResponse.length < 14) {
      if (saleResponse.paymentType === TRANSFER) {
        docDefinition.content = [...tableContent, ...barCodeContent];
      } else {
        docDefinition.content = [...tableContent];
      }
      productsResponse.forEach((product) => {
        let body = [];
        body.push({ text: product.name, style: 'textLeft' });
        body.push({ text: product.amount, style: 'textRight' });
        body.push({ text: formatMoney(product.unitPrice), style: 'textRight' });
        body.push({ text: formatMoney(product.subtotal), style: 'textRight' });
        body.push({ text: '', style: '' });
        docDefinition.content[6].table.body.push(body);
      });
      for (let i = 0; i < 13 - productsResponse.length; i++) {
        docDefinition.content[6].table.body.push([{ text: 'none', color: '#ffffff' }, '', '', '', ''] as string[]);
      }
      docDefinition.content[6].table.body = [...docDefinition.content[6].table.body, ...lastTableContent];
    } else {
      if (saleResponse.paymentType === TRANSFER) {
        const pageFirstContent = _.cloneDeep(tableContent);
        for (let i = 0; i < MAX_RECORD_TABLE_PER_PAGE; i++) {
          let body = [];
          body.push({ text: productsResponse[i].name, style: 'textLeft' });
          body.push({ text: productsResponse[i].amount, style: 'textRight' });
          body.push({ text: formatMoney(productsResponse[i].unitPrice), style: 'textRight' });
          body.push({ text: formatMoney(productsResponse[i].subtotal), style: 'textRight' });
          body.push({ text: '', style: '' });
          pageFirstContent[6].table.body.push(body);
        }

        const pageSecondContent = _.cloneDeep(tableContent);
        const pageSecondBarCodeContent = _.cloneDeep(barCodeContent);

        for (let i = MAX_RECORD_TABLE_PER_PAGE; i < productsResponse.length; i++) {
          let body = [];
          body.push({ text: productsResponse[i].name, style: 'textLeft' });
          body.push({ text: productsResponse[i].amount, style: 'textRight' });
          body.push({ text: formatMoney(productsResponse[i].unitPrice), style: 'textRight' });
          body.push({ text: formatMoney(productsResponse[i].subtotal), style: 'textRight' });
          body.push({ text: '', style: '' });
          pageSecondContent[6].table.body.push(body);
        }
        for (let i = 0; i < 13 - (productsResponse.length - MAX_RECORD_TABLE_PER_PAGE); i++) {
          pageSecondContent[6].table.body.push([{ text: 'none', color: '#ffffff' }, '', '', '', ''] as string[]);
        }
        pageSecondContent[6].table.body = [...pageSecondContent[6].table.body, ...lastTableContent];

        docDefinition.content = [
          ...pageFirstContent,
          ...barCodeContent,
          {
            text: '\n\n\n\n\n\n\n',
            alignment: 'right',
            margin: [0, 8, 0, 0],
          },
          ...pageSecondContent,
          ...pageSecondBarCodeContent,
        ];
      } else {
        docDefinition.content = [...tableContent];

        productsResponse.forEach((product) => {
          let body = [];
          body.push({ text: product.name, style: 'textLeft' });
          body.push({ text: product.amount, style: 'textRight' });
          body.push({ text: formatMoney(product.unitPrice), style: 'textRight' });
          body.push({ text: formatMoney(product.subtotal), style: 'textRight' });
          body.push({ text: '', style: '' });
          docDefinition.content[6].table.body.push(body);
        });
        docDefinition.content[6].table.body = [...docDefinition.content[6].table.body, ...lastTableContent];
      }
    }

    const options = {};
    let fileName = saleId + '.pdf';
    let filePath = path.join(process.cwd(), fileName);
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(fileName));
    pdfDoc.end();
    await delay(1000);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('end', () => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.log(error);

        throw new BadRequestException('An error occurred while removing the file.');
      }
    });

    return new StreamableFile(fileStream);
  }

  async getPaymentStatementPDF(saleId: string) {
    const detailSale = await this.getSaleById(saleId);

    const fonts = {
      MinchoW4: {
        normal: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        bold: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        italics: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
        bolditalics: path.join(__dirname, '../..', 'public', '/fonts/MinchoW4.ttf'),
      },
      CenturyGothic: {
        normal: path.join(__dirname, '../..', 'public', '/fonts/CenturyGothic.ttf'),
      },
    };

    const staff = await this.memberRepo.findOne({
      where: {
        id: Equal(detailSale.data.sale?.staffId),
      },
    });

    const payment = await this.getPayment(saleId);

    const bodyProduct = [];
    bodyProduct.push(['商品No', '商品名', '単価', '数量', '金額']);
    detailSale.data.products?.map((item) => {
      return bodyProduct.push([
        { text: item.id, alignment: 'center' },
        { text: item.name, style: 'textLeft' },
        { text: formatMoney(item.unitPrice), style: 'textRight' },
        { text: item.amount, style: 'textRight' },
        { text: formatMoney(item.subtotal), style: 'textRight' },
      ]);
    });
    bodyProduct.push([
      '',
      { text: '値引き', style: 'textLeft', color: 'red' },
      '',
      '',
      { text: '(' + formatMoney(detailSale.data.sale?.discount) + ')', style: 'textRight', color: 'red' },
    ]);
    bodyProduct.push([
      '',
      { text: '合計金額', style: 'textLeft' },
      '',
      '',
      { text: formatMoney(detailSale.data.sale?.total), style: 'textRight' },
    ]);

    const paymentPlan = await this.paymentPlanRepo.find({
      where: {
        newest_sale_id: Equal(detailSale.data.sale?.saleId),
      },
    });

    const paymentPlanNumber = paymentPlan.filter((item) => item.status == 0).length;

    const receivedTransaction = await this.receivedTransactionRepo.findOne({
      where: {
        newest_sale_id: Equal(detailSale.data.sale?.saleId),
      },
      order: {
        updated: 'DESC',
      },
    });

    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: {
        id: Equal(detailSale.data.sale?.paymentType),
      },
    });

    const widthsPlan = ['*'];
    const planDateFirstTime = [{ text: '期日' }];
    const planAmountFirstTime = [{ text: '金額', font: 'MinchoW4' }];
    const planTypeFirstTime = [{ text: '支払方法' }];
    const planIdFirstTime = [{ text: '回数' }];

    const planDateSecondTime = ['期日'];
    const planAmountSecondTime = [{ text: '金額', font: 'MinchoW4' }];
    const planTypeSecondTime = ['支払方法'];
    const planIdSecondTime = ['回数'];

    for (let index = 0; index < 5; index++) {
      planIdFirstTime.push({ text: String(index + 1) }),
        widthsPlan.push('*'),
        planDateFirstTime.push(
          paymentPlan[index]?.payment_date
            ? { text: dayjs(paymentPlan[index]?.payment_date).format('YYYY/MM/DD') }
            : { text: '' },
        );
      planAmountFirstTime.push(
        paymentPlan[index]?.payment_amount
          ? { text: '¥ ' + formatMoney(String(paymentPlan[index]?.payment_amount)), font: 'CenturyGothic' }
          : { text: '', font: 'MinchoW4' },
      );
      planTypeFirstTime.push(paymentPlan[index]?.id ? { text: paymentMethod?.name } : { text: '' });
    }

    for (let index = 5; index < 10; index++) {
      planIdSecondTime.push(String(index + 1)),
        planDateSecondTime.push(
          paymentPlan[index]?.payment_date ? dayjs(paymentPlan[index]?.payment_date).format('YYYY/MM/DD') : '',
        );
      planAmountSecondTime.push(
        paymentPlan[index]?.payment_amount
          ? { text: '¥ ' + formatMoney(String(paymentPlan[index]?.payment_amount)), font: 'CenturyGothic' }
          : { text: '', font: 'MinchoW4' },
      );
      planTypeSecondTime.push(paymentPlan[index]?.id ? paymentMethod?.name : '');
    }

    const PdfPrinter = require('pdfmake');
    const printer = new PdfPrinter(fonts);
    const docDefinition = {
      pageSize: 'A4',
      content: [
        {
          text: '分割支払明細書\n\n',
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
        {
          columns: [
            {
              table: {
                body: [
                  [
                    {
                      fontSize: 15,
                      border: [false, false, false, true],
                      text: detailSale.data.sale?.customerName,
                      bold: true,
                      alignment: 'center',
                    },
                    {
                      border: [false, false, false, false],
                      text: '様',
                      fontSize: 12,
                      margin: [0, 5, 0, 0],
                    },
                  ],
                  [
                    {
                      fontSize: 15,
                      border: [false, false, false, false],
                      text: '伝票NO.' + detailSale.data.sale?.saleId,
                      alignment: 'center',
                      bold: true,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      border: [false, false, false, false],
                      text: '',
                    },
                  ],
                ],
              },
            },
            {
              columns: [
                { with: '*', text: '' },
                {
                  width: 'auto',
                  table: {
                    body: [
                      [
                        {
                          border: [false, false, false, false],
                          fontSize: 10,
                          text: '〒810-0042\n',
                          alignment: 'left',
                        },
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          fontSize: 10,
                          text: '福岡県福岡市中央区赤坂1-14-22',
                          alignment: 'left',
                        },
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          fontSize: 10,
                          text: '株式会社　晴活堂',
                          alignment: 'left',
                        },
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          fontSize: 10,
                          text: 'お問合せ先：0120-12-12-98',
                          alignment: 'left',
                        },
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          margin: [0, 0, 0, 0],
                          fontSize: 15,
                          bold: true,
                          text: '担当: ' + staff.name,
                          alignment: 'center',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          text: 'この度は弊社商品をお買い上げいただきまして誠にありがとうございます。',
          alignment: 'left',
        },
        {
          text: '今後のお支払い予定は下記記載の通りでございます。',
          alignment: 'left',
          margin: [0, 5, 0, 5],
        },
        {
          text: 'ご確認の上、何卒宜しくお願い致します。',
          alignment: 'left',
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: '*',
              table: {
                body: [
                  [
                    {
                      border: [false, false, false, false],
                      fontSize: 15,
                      text: '',
                      alignment: 'center',
                    },
                  ],
                  [
                    {
                      border: [false, false, false, false],
                      fontSize: 15,
                      bold: true,
                      margin: [0, 15, 0, 0],
                      text: 'お買い上げ商品一覧',
                      alignment: 'center',
                    },
                  ],
                ],
              },
            },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    {
                      fontSize: 12,
                      text: '注文日',
                      bold: true,
                      alignment: 'center',
                    },
                    {
                      text: dayjs(detailSale.data.sale?.orderDate).format('YYYY/MM/DD'),
                      fontSize: 12,
                      bold: true,
                      alignment: 'center',
                    },
                  ],
                  [
                    {
                      fontSize: 12,
                      bold: true,
                      text: 'お届け日',
                      alignment: 'center',
                    },
                    {
                      fontSize: 12,
                      bold: true,
                      text: dayjs(detailSale.data.sale?.shippingDate).format('YYYY/MM/DD'),
                      alignment: 'center',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          margin: [0, 15, 0, 15],
          fontSize: 10,
          style: 'tableExample',
          table: {
            widths: [50, 200, '*', '*', '*'],
            body: bodyProduct,
          },
        },
        {
          text: 'お支払明細',
          fontSize: 15,
          bold: true,
        },
        {
          margin: [0, 5, 0, 15],
          columns: [
            { width: 'auto', text: '' },
            {
              fontSize: 10,
              width: '*',
              style: 'tableExample',
              table: {
                widths: ['*', '*', '*', '*'],
                body: [
                  ['総額', '入金済', '残金額', '残分割回数'],
                  [
                    {
                      text: '¥ ' + formatMoney(payment.total),
                      alignment: 'center',
                      font: 'CenturyGothic',
                    },
                    {
                      text:
                        '¥ ' + formatMoney(receivedTransaction ? payment.total - receivedTransaction?.remaining : 0),
                      alignment: 'center',
                      font: 'CenturyGothic',
                    },
                    {
                      text: '¥ ' + formatMoney(receivedTransaction ? receivedTransaction?.remaining : payment.total),
                      alignment: 'center',
                      font: 'CenturyGothic',
                    },
                    { text: paymentPlanNumber, alignment: 'center', font: 'CenturyGothic' },
                  ],
                ],
              },
            },
            { width: 'auto', text: '' },
          ],
        },
        {
          text: '支払内容',
          fontSize: 15,
          bold: true,
        },
        {
          fontSize: 10,
          margin: [0, 5, 0, 10],
          style: 'tableExample',
          table: {
            widths: widthsPlan,
            body: [planIdFirstTime, planDateFirstTime, planAmountFirstTime, planTypeFirstTime],
          },
        },
        {
          fontSize: 10,
          margin: [0, 5, 0, 0],
          style: 'tableExample',
          table: {
            widths: widthsPlan,
            body: [planIdSecondTime, planDateSecondTime, planAmountSecondTime, planTypeSecondTime],
          },
        },
      ],
      styles: {
        subtitle: {
          margin: [200, 115, 0, 0],
        },
        header: {
          margin: [0, 5, 0, 15],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
        textLeft: {
          alignment: 'left',
        },
        textRight: {
          alignment: 'right',
        },
      },
      defaultStyle: {
        fontSize: 9,
        font: 'MinchoW4',
      },
    };

    const options = {};

    let fileName = saleId;
    let filePath = path.join(process.cwd(), fileName);
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(fileName));
    pdfDoc.end();
    await delay(1000);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('end', () => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        throw new BadRequestException('An error occurred while removing the file.');
      }
    });

    return new StreamableFile(fileStream);
  }

  async exportToCsv(saleId: string) {
    const detailSale = await this.getSaleById(saleId);

    let deliveryTime = '';

    switch (detailSale.data.shipment.deliveryTime) {
      case SHIPMENT_TIME_OPTION[0].value:
        deliveryTime = SHIPMENT_TIME_OPTION[0].label;
        break;
      case SHIPMENT_TIME_OPTION[1].value:
        deliveryTime = SHIPMENT_TIME_OPTION[1].label;
        break;
      case SHIPMENT_TIME_OPTION[2].value:
        deliveryTime = SHIPMENT_TIME_OPTION[2].label;
        break;
      case SHIPMENT_TIME_OPTION[3].value:
        deliveryTime = SHIPMENT_TIME_OPTION[3].label;
        break;
      case SHIPMENT_TIME_OPTION[4].value:
        deliveryTime = SHIPMENT_TIME_OPTION[4].label;
        break;
      default:
        deliveryTime = SHIPMENT_TIME_OPTION[6].label;
        break;
    }

    const paymentPlan = await this.paymentPlanRepo.findOne({
      where: {
        newest_sale_id: Equal(detailSale.data.sale?.saleId),
        payment_number: FIRST_PAYMENT,
      },
    });

    const products = await this.saleProductRepo.find({
      where: {
        sale_id: Equal(saleId),
      },
    });

    let subTax = 0;
    const taxProduct = products.map((data) => {
      subTax = subTax + data.subtax;
      return subTax;
    });

    const payment = await this.getPayment(saleId);

    const consumptionTax = taxCalculation(subTax, detailSale.data.sale.shippingFee, payment.fee);

    let data = [];
    data[0] = '';
    data[1] = detailSale.data.shipment.deliveryTel;
    data[2] = detailSale.data.shipment.deliveryZip;
    data[3] = detailSale.data.shipment.deliveryAddress1;
    data[4] = detailSale.data.shipment.deliveryAddress2;
    data[5] = detailSale.data.shipment.deliveryAddress3;
    data[6] = detailSale.data.sale.customerName;
    data[7] = '';
    data[8] = detailSale.data.sale.customerId;
    data[9] = '';
    data[10] = '';
    data[11] = '';
    data[12] = '092-720-3633';
    data[13] = '810-0042';
    data[14] = 'フクオカケンフクオカシ';
    data[15] = 'チュウオウクアカサカ';
    data[16] = ' カ）セイカツドウ';
    data[17] = '';
    data[18] = '';
    data[19] = 'ケンコウショクヒン';
    data[20] = '';
    data[21] = '';
    data[22] = '';
    data[23] = '';
    data[24] = '';
    data[25] = '';
    data[26] = '001';
    data[27] = dayjs(detailSale.data.shipment.deliveryDate).format('YYYYMMDD');
    data[28] = deliveryTime;
    data[29] = '';
    data[30] = paymentPlan.payment_amount;
    data[31] = consumptionTax;
    data[32] = '';
    data[33] = '';
    data[34] = '';
    data[35] = '005';
    data[36] = '009';
    data[37] = '';
    data[38] = '';
    data[39] = '';
    data[40] = '';
    data[41] = '';

    let fileName = saleId + '_sagawa.csv';
    let filePath = path.join(process.cwd(), fileName);
    const csvString = `${data.join(',')}` + ',';
    const csvStringWithBOM = '\uFEFF' + csvString;
    fs.writeFileSync(filePath, csvStringWithBOM, { encoding: 'utf-8' });
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('end', () => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        throw new BadRequestException('An error occurred while removing the file.');
      }
    });

    return new StreamableFile(fileStream);
  }

  async getSaleCSVYuupakku(saleId: string) {
    try {
      const { saleResponse, shipmentResponse, productsResponse, firstPaymentPlan, subTax } =
        await this.getSaleInfoForExport(saleId);

      const payment = await this.getPayment(saleId);

      const consumptionTax = taxCalculation(subTax, saleResponse.shippingFee, payment.fee);

      let content = [];
      content[0] = 'DENKAKUTEI';
      content[1] = dayjs(saleResponse.shippingDate).format('YYYYMMDD');
      content[2] = '';
      content[3] = '';
      content[4] = '';
      content[5] = 1;
      content[6] = '';
      content[7] = saleResponse.saleId.slice(saleResponse.saleId.length - 8, saleResponse.saleId.length);
      content[8] = '';
      content[9] = '';
      content[10] = '株式会社晴活堂';
      content[11] = '092-720-3633';
      content[12] = '810-0042';
      content[13] = '福岡県福岡市中央区赤坂1-14-22';
      content[14] = shipmentResponse.deliveryName;
      content[15] = shipmentResponse.deliveryTel;
      content[16] = shipmentResponse.deliveryZip;
      content[17] =
        shipmentResponse.deliveryAddress1 + shipmentResponse.deliveryAddress2 + shipmentResponse.deliveryAddress3;
      content[18] = dayjs(shipmentResponse.deliveryDate).format('YYYYMMDD');
      content[19] = SHIPMENT_TIME_OPTION.find((item) => shipmentResponse.deliveryTime == item.value)?.titleCSV;
      content[20] = firstPaymentPlan.payment_amount;
      content[21] = consumptionTax;
      content[22] = productsResponse[0]?.name + '等' ?? '';
      content[23] = '';
      content[24] = '';
      content[25] = '';
      content[26] = '';
      content[27] = '';
      content[28] = '';
      content[29] = '';
      content[30] = '';
      content[31] = '';
      content[32] = '';
      content[33] = '';
      content[34] = '';
      content[35] = '';
      content[36] = '';
      content[37] = '';
      content[38] = '';
      content[39] = '';
      content[40] = '';
      content[41] = '';
      content[42] = '';
      content[43] = '';
      content[44] = '';
      content[45] = '';
      content[46] = '';
      content[47] = '';
      content[48] = '';
      content[49] = '';
      content[50] = '';
      return this.responseOk(content);
    } catch (err) {
      this.logger.debug('export csv sale failed', err);
      throw new HttpException(MSG.SALE + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async getSaleInfoForExport(saleId: string) {
    const saleData = await this.saleRepo
      .createQueryBuilder('S')
      .leftJoinAndSelect('S.shipment', 'SM')
      .leftJoinAndSelect('S.payment', 'P')
      .leftJoinAndSelect('S.paymentHistories', 'PH')
      .leftJoinAndSelect('S.receives', 'R')
      .leftJoinAndSelect('S.memberConfirmStaff', 'MCS')
      .leftJoinAndSelect('S.memberShipmentStaff', 'MS')
      .leftJoinAndSelect('S.staff', 'ST')
      .andWhere('S.id = :saleId', { saleId: saleId })
      .getOne();
    const saleResponse = new ResListSaleDto(saleData);
    const shipmentResponse = new ShipmentResDto(saleData);

    const productData = await this.saleProductRepo
      .createQueryBuilder('SP')
      .leftJoinAndSelect('SP.product', 'SPP')
      .andWhere('SP.sale_id = :saleId', { saleId: saleId })
      .orderBy('SP.sort', 'ASC')
      .getMany();
    let subTax = 0;
    const productsResponse = productData.map((data) => {
      subTax = subTax + data.subtax;
      return new ProductResDto(data);
    });
    const salePaymentPlan = await this.saleRepo
      .createQueryBuilder('S')
      .leftJoinAndSelect('S.paymentPlan', 'PPL')
      .andWhere('S.id = :saleId', { saleId: saleId })
      .orderBy({ 'PPL.payment_date': 'ASC' })
      .limit(1)
      .getOne();
    const firstPaymentPlan = salePaymentPlan.paymentPlan[0];
    return { saleResponse, shipmentResponse, productsResponse, firstPaymentPlan, subTax };
  }
}

function formatMoney(str: string | number) {
  if (Number(str) < 0 || !str) return '0';
  const money = String(Number(str).toFixed(0));
  return money
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev;
    });
}

function formatMoneyToString(str: string | number) {
  if (Number(str) < 0 || !str) return '0';
  const money = String(Number(str));
  let moneyString = '';
  for (let i = 0; i < money.length; i++) {
    moneyString = moneyString + money.slice(i, i + 1) + (i === money.length - 1 ? '' : '   ');
  }

  return moneyString;
}

function formatSaleBarCode(saleId: string, customerCode: string, firstPayment: string) {
  let barCode = '(91) 929023-22920';
  if (customerCode.length < 8) customerCode = customerCode.padStart(8, '0');
  barCode = barCode + customerCode + saleId.slice(saleId.length - 8, saleId.length);
  barCode = barCode + '0999999-0-';
  if (firstPayment.length < 6) firstPayment = firstPayment.padStart(6, '0') + '-';
  else firstPayment = firstPayment.slice(firstPayment.length - 6, firstPayment.length);
  barCode = barCode + firstPayment;
  let totalEven = 0;
  let totalOdd = 0;
  for (let i = 0; i < barCode.length; i++) {
    const str = barCode.slice(i, i + 1);
    if (!Number.isNaN(Number(str)) && Number(str) % 2 === 0) {
      totalOdd = totalOdd + Number(str);
    }
    if (!Number.isNaN(Number(str)) && Number(str) % 2 !== 0) {
      totalEven = totalEven + Number(str);
    }
  }
  totalOdd = totalOdd * 3;
  const total = totalEven + totalOdd;
  const lastNumber = `${total}`.slice(`${total}`.length - 1, `${total}`.length);
  barCode = barCode + (10 - Number(lastNumber) < 10 ? `${10 - Number(lastNumber)}` : '0');

  return barCode;
}

function taxCalculation(subTax: number, shippingFee: number, fee: number) {
  return Math.round(subTax + fee / 1.01 + shippingFee / 1.01);
}
