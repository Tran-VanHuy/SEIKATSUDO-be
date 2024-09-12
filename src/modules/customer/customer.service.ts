import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Equal } from 'typeorm';
import { Customer } from 'src/entities/customer.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ReqCustomerTransactionDto } from './dto/req.list.dto';
import { CustomerDto } from './dto/res.list.dto';
import { CreateCustomer } from './dto/create.req.dto';
import { constants, firstCustomerId } from 'src/constants/constant';
import { CategoryKikkake } from 'src/entities/category-kikkake.entity';
import { ProductKikkake } from 'src/entities/product-kikkake.entity';
import { MasterCustomer } from 'src/entities/master-customer.entity';
import { Category } from 'src/entities/category-customer.entity';
import { Sale } from 'src/entities/sale.entity';
import { MSG } from 'src/constants/constant';
import { ResListSaleDto } from '../sale/dto/response.dto/res.list.dto';
import { CustomerInfoDto } from './dto/res.info.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CustomerService extends BaseService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    @InjectRepository(CategoryKikkake) private readonly categoryKikkakeRepo: Repository<CategoryKikkake>,
    @InjectRepository(ProductKikkake) private readonly productKikkakeRepo: Repository<ProductKikkake>,
    @InjectRepository(MasterCustomer) private readonly masterCustomerRepo: Repository<MasterCustomer>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  findAll() {
    return this.customerRepo.find();
  }

  async findAllCustomer(options: IPaginationOptions, query: ReqCustomerTransactionDto) {
    try {
      const queryBuilder = this.customerRepo.createQueryBuilder('C');
      if (query.id) {
        queryBuilder.andWhere('C.id LIKE :id', { id: `%${query.id}%` });
      }
      if (query.name) {
        queryBuilder.andWhere('C.name LIKE :name', { name: `%${query.name}%` });
      }
      queryBuilder.andWhere('C.disabled != 0').orderBy('C.created', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      const data = {
        items: paginateData.items.map((data) => new CustomerDto(data)),
        meta: paginateData.meta,
      };
      return this.responseOk(data);
    } catch (err) {
      this.logger.debug('search customer failed', err);
      throw new BadRequestException('Search customer failed');
    }
  }

  async getCustomerById(customerId: string) {
    try {
      const customer = await this.customerRepo
        .createQueryBuilder('')
        .where('id = :customerId', { customerId: customerId })
        .getOne();
      const customerRes = new CustomerDto(customer);

      return this.responseOk(customerRes);
    } catch (err) {
      this.logger.debug('get customer information failed', err);
      throw new BadRequestException('Get customer information failed');
    }
  }

  async getCategoriesKikkake(): Promise<CategoryKikkake[]> {
    return this.categoryKikkakeRepo.createQueryBuilder('CK').orderBy('id', 'DESC').getMany();
  }

  async getProductsKikkake(): Promise<ProductKikkake[]> {
    return this.productKikkakeRepo.createQueryBuilder('PK').orderBy('id', 'DESC').getMany();
  }

  async getMasterCustomers(): Promise<MasterCustomer[]> {
    return this.masterCustomerRepo.createQueryBuilder().where('parent_id IS NOT NULL').getMany();
  }

  async getParentMasterName(): Promise<MasterCustomer[]> {
    return this.masterCustomerRepo.createQueryBuilder().where('parent_id IS NULL').getMany();
  }

  async getChildMasterName(parentId: number): Promise<MasterCustomer[]> {
    return this.masterCustomerRepo
      .createQueryBuilder('MS')
      .where('MS.parent_id = :parentId', { parentId: parentId })
      .getMany();
  }

  async createNewCustomerId() {
    const customer = await this.customerRepo
      .createQueryBuilder('C')
      .withDeleted()
      .orderBy('C.id', 'DESC')
      .limit(1)
      .getOne();
    let newId = firstCustomerId;
    if (customer) {
      let customerIdFirst = String(customer.id).slice(0, 1);
      let customerIdLast = String(customer.id).slice(1, customer.id.length);
      newId = customerIdFirst + String(Number(customerIdLast) + 1).padStart(7, '0');
    }

    return this.responseOk(newId);
  }

  async createCustomer(body: CreateCustomer) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      customer: {
        customerId,
        staffId,
        category,
        product,
        customerRefeId,
        disableCus,
        sendMailToCus,
        callTellToCus,
        dateCreateCus,
        parentCode,
        customerName,
        kataName,
        birthCustomer,
        gender,
        shippingDate,
        dateUpdate,
      },
      addressInfo: {
        tel1,
        zipCode1,
        address11,
        address12,
        address13,
        tel2,
        zipCode2,
        address21,
        address22,
        address23,
        tel3,
        zipCode3,
        address31,
        address32,
        address33,
        emailPC,
        emailMobile,
      },
      remarks: { note1, note2, customerNote },
      medicalRecord: {
        mySelfTalk,
        myWifeTalk,
        otherTalk,
        textOtherTalk,
        mySelfDrink,
        myWifeDrink,
        otherDrink,
        textOtherDrink,
        legsHips,
        bloodPressure,
        pedigree,
        insomnia,
        otherSymptoms,
        otherSymptomsText,
        medicinesFoodsText,
        job,
        assignedPerson,
        son,
        daughter,
        wife,
        father,
        mother,
        etc,
        total,
      },
      categoriesCustomer,
    } = body;

    const customerData = this.customerRepo.create({
      id: customerId,
      staffcode: staffId,
      category: category,
      product: product,
      customer_refe_id: customerRefeId,
      disabled: disableCus,
      dissend_dm: sendMailToCus,
      dissend_tel: callTellToCus,
      publish: dateCreateCus,
      parents_code: parentCode,
      name: customerName,
      kana: kataName,
      birth: birthCustomer,
      gender: gender,
      shipping_date: shippingDate,
      update_customer: dateUpdate,
      telno1: tel1,
      zip1: zipCode1,
      addr11: address11,
      addr12: address12,
      addr13: address13,
      telno2: tel2,
      zip2: zipCode2,
      addr21: address21,
      addr22: address22,
      addr23: address23,
      telno3: tel3,
      zip3: zipCode3,
      addr31: address31,
      addr32: address32,
      addr33: address33,
      email: emailPC,
      imode: emailMobile,
      note1: note1,
      note2: note2,
      attention: customerNote,
      my_self_talk: mySelfTalk,
      my_wife_talk: myWifeTalk,
      other_talk: otherTalk,
      text_other_talk: textOtherTalk,
      my_self_drink: mySelfDrink,
      my_wife_drink: myWifeDrink,
      other_drink: otherDrink,
      text_other_drink: textOtherDrink,
      legs_hips: legsHips,
      blood_ressure: bloodPressure,
      pedigree: pedigree,
      insomnia: insomnia,
      other_symptoms: otherSymptoms,
      other_symptoms_text: otherSymptomsText,
      medicines_foods_text: medicinesFoodsText,
      job: job,
      assigned_person: assignedPerson,
      son: son,
      daughter: daughter,
      wife: wife,
      father: father,
      mother: mother,
      etc: etc,
      total: total,
    });

    const dataCategoriesCustomers = [];

    if (categoriesCustomer.length > 0) {
      for (let categoryCustomer of categoriesCustomer) {
        if (categoryCustomer.masterCustomerId !== 0) {
          dataCategoriesCustomers.push({
            customer_id: customerId,
            master_customer_id: categoryCustomer.masterCustomerId,
          });
        }
      }
    }

    const dataCategoriesCustomerCreate = this.categoryRepo.create(dataCategoriesCustomers);

    const customerExist = await this.customerRepo.findOne({
      where: {
        id: Equal(customerId),
      },
    });

    if (customerExist) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }

    try {
      await queryRunner.manager.save(customerData);
      if (dataCategoriesCustomers.length > 0) {
        await queryRunner.manager.save(dataCategoriesCustomerCreate);
      }
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create customer failed', err);
      throw new HttpException('Cannot insert this customer', constants.STATUS_ERROR.VALUE);
    } finally {
      await queryRunner.release();
    }
  }

  async getCustomerInfos(customerId: string) {
    let shipmentNewBySale = await this.saleRepo.createQueryBuilder('S').leftJoinAndSelect('S.shipment', 'SS').where('S.customer_id = :customerId', { customerId: customerId }).orderBy('S.created', 'DESC').getOne()
    const addressCustomerBySale = shipmentNewBySale?.shipment.customer_address_id

    const customer = await this.customerRepo
      .createQueryBuilder('C')
      .withDeleted()
      .leftJoinAndSelect('C.sale', 'S')
      .leftJoinAndSelect('S.payment', 'P')
      .leftJoinAndSelect('C.staff', 'ST')
      .leftJoinAndSelect('C.customerRef', 'CR')
      .andWhere('C.id = :customerId', { customerId: customerId })
      .limit(1)
      .orderBy('S.id', 'DESC')
      .getOne();
    const customerRes = customer ? new CustomerInfoDto(customer) : null;

    return this.responseOk({ customerRes, addressCustomerBySale });
  }


  async getSaleCustomer(query: ReqCustomerTransactionDto) {
    try {
      const saleCustomer = this.saleRepo
        .createQueryBuilder('S')
        .leftJoinAndSelect('S.payment', 'P')
        .leftJoinAndSelect('S.paymentHistories', 'PH')
        .leftJoinAndSelect('S.receives', 'R')
        .leftJoinAndSelect('S.memberConfirmStaff', 'MCS')
        .leftJoinAndSelect('S.memberShipmentStaff', 'MS')
        .leftJoinAndSelect('S.staff', 'ST')
        .leftJoinAndSelect('S.saleProducts', 'SP')
        .andWhere('S.customer_id = :id', { id: query.id })
        .orderBy('S.created', 'DESC')

      const paginateData = await this.customPaginate<Sale>(
          saleCustomer,
          Number(query.rowsPerPage),
          Number(query.currentPage),
      );
      const saleCustomerRes = paginateData.items.map((data) => new ResListSaleDto(data));
      const saleCustomerPaginate = {
        items: saleCustomerRes,
        meta: paginateData.meta,
      };
      return this.responseOk( saleCustomerPaginate );
    } catch (err) {
      this.logger.debug('search sale failed', err);
      throw new HttpException(MSG.SALE + MSG.SEARCH_FAIL, HttpStatus.BAD_REQUEST);
    }
  }
}
