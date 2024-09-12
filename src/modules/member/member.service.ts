import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Member } from 'src/entities/member.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ListMemberTransactionDto } from './dto/request.dto/list.dto';
import { MemberDto } from './dto/response.dto/list.dto';
import { CreateMemberTransactionDto } from './dto/request.dto/create.dto';
import { MSG, REGEX, FIRST_STAFF_CODE, STAFF_IS_DISABLED } from 'src/constants/constant';
import { UpdateMemberTransactionDto } from './dto/request.dto/update.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MemberService extends BaseService {
  constructor(
    @InjectRepository(Member) private readonly userRepo: Repository<Member>,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async findOneByStaffcode(staffcode: string): Promise<Member | null> {
    return this.userRepo
      .createQueryBuilder('M')
      .where('staffcode = :staffcode', { staffcode })
      .andWhere('disabled = :disable', { disable: !STAFF_IS_DISABLED })
      .getOne();
  }

  async findOneByCondition(options: object): Promise<Member | null> {
    return this.userRepo.findOne(options);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findAllStaff(options: IPaginationOptions, query: ListMemberTransactionDto) {
    try {
      const queryBuilder = this.userRepo.createQueryBuilder('C');
      if (query.staffCode) {
        queryBuilder.andWhere('C.staffcode = :staffCode', { staffCode: query.staffCode });
      }
      if (query.name) {
        queryBuilder.andWhere('C.name = :name', { name: query.name });
      }
      if (query.kana) {
        queryBuilder.andWhere('C.kana = :kana', { kana: query.kana });
      }
      queryBuilder.orderBy('C.created', 'DESC');
      const paginateData = await paginate(queryBuilder, options);
      const data = {
        items: paginateData.items.map((data) => new MemberDto(data)),
        meta: paginateData.meta,
      };

      return this.responseOk(data);
    } catch (err) {
      this.logger.debug('search staff failed', err);
      throw new HttpException(MSG.STAFF + MSG.SEARCH_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async createStaff(body: CreateMemberTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const oldStaff = await this.userRepo
      .createQueryBuilder('U')
      .where('U.staffcode = :staffCode', { staffCode: body.staffCode })
      .getOne();

    let errors = {};
    errors = this.validateStaff(body);
    if (oldStaff) {
      throw new BadRequestException(this.i18n.t('messages.errorDuplicateID'));
    }
    if (Object.keys(errors).length > 0) throw new HttpException({ message: errors }, HttpStatus.BAD_REQUEST);

    const bcrypt = require('bcrypt');
    const password = await bcrypt.hash(body.password, 10);
    const dataStaff = this.userRepo.create({
      staffcode: body.staffCode,
      name: body.name,
      kana: body.kana,
      email: 'aaa',
      note: body.note,
      startdate: body.startDate,
      enddate: body.endDate,
      disabled: body.disabled,
      password: password,
      authority: body.authority,
    });

    try {
      await queryRunner.manager.save(dataStaff);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('create staff failed', err);
      throw new HttpException(MSG.STAFF + MSG.CREATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softDelete(Member, id);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('delete staff failed', err);
      throw new HttpException(MSG.STAFF + MSG.DELETE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async getStaffById(id: string) {
    try {
      const staffData = await this.userRepo.createQueryBuilder('S').where('S.id = :id', { id: id }).getOne();
      const staffResponse = new MemberDto(staffData);

      return this.responseOk(staffResponse);
    } catch (err) {
      this.logger.debug('get staff detail failed', err);
      throw new HttpException(MSG.STAFF + MSG.GET_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async updateStaff(body: UpdateMemberTransactionDto, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const oldStaff = await this.userRepo
      .createQueryBuilder('U')
      .where('U.staffcode = :staffCode', { staffCode: body.staffCode })
      .andWhere('U.id != :id', { id })
      .getOne();

    let errors = {};
    errors = this.validateStaff(body);
    if (oldStaff) {
      errors['staffCode'] = MSG.DUPLICATE_STAFF;
    }
    if (Object.keys(errors).length > 0) throw new HttpException({ message: errors }, HttpStatus.BAD_REQUEST);

    const dataStaff = {
      staffcode: body.staffCode,
      name: body.name,
      kana: body.kana,
      email: 'aaa',
      note: body.note,
      startdate: body.startDate,
      enddate: body.endDate,
      disabled: body.disabled,
      authority: body.authority,
    };

    if (body.password) {
      const bcrypt = require('bcrypt');
      const password = await bcrypt.hash(body.password, 10);
      dataStaff['password'] = password;
    }

    try {
      await queryRunner.manager.update(Member, id, dataStaff);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('update sale failed', err);
      throw new HttpException(MSG.STAFF + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  validateStaff(body: CreateMemberTransactionDto | UpdateMemberTransactionDto) {
    let errors = {};
    if (body.password && !REGEX.PASSWORD_RULE.test(body.password)) {
      errors['password'] = MSG.PASSWORD;
    }
    if (body.password && body.password !== body.confirmPassword) {
      errors['confirmPassword'] = MSG.CONFIRM_PASSWORD;
    }
    if (body.name.length > 255) {
      errors['name'] = MSG.MAX_LENGTH_255;
    }
    if (!REGEX.KANA_MAX_LENGTH_255.test(body.kana)) {
      errors['kana'] = MSG.KATAKANA;
    }
    if (body.note && body.note.length > 255) {
      errors['note'] = MSG.MAX_LENGTH_255;
    }
    if (body.endDate && body.startDate > body.endDate) {
      errors['endDate'] = MSG.START_END_DATE;
    }

    return errors;
  }

  async getStaffByEmail(email: string) {
    try {
      const member = await this.dataSource
        .createQueryBuilder(Member, 'member')
        .where('member.email = :email', { email })
        .getOne();

      return member;
    } catch (err) {
      throw new HttpException(this.i18n.t('messages.member.existMember'), HttpStatus.BAD_REQUEST);
    }
  }

  async getStaffByToken(token: string) {
    try {
      const member = await this.dataSource
        .createQueryBuilder(Member, 'member')
        .where('member.reset_password_token = :token', { token })
        .getOne();

      return member;
    } catch (err) {
      throw new HttpException(this.i18n.t('messages.member.existToken'), HttpStatus.BAD_REQUEST);
    }
  }

  async getNewIdStaff() {
    const staff = await this.userRepo.createQueryBuilder().withDeleted().orderBy('id', 'DESC').limit(1).getOne();
    let newStaffCode = FIRST_STAFF_CODE;
    if (staff) {
      let staffCodeLast = String(staff.staffcode).slice(1, staff.staffcode.length);
      newStaffCode = String(Number(staffCodeLast) + 1).padStart(5, '0');
    }

    return this.responseOk(newStaffCode);
  }
}
