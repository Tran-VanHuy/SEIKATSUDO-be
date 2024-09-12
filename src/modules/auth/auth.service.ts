import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { BaseService } from '../base/base.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { Member } from 'src/entities/member.entity';
import mailConfig from 'src/config/mail.config';
import { I18nService } from 'nestjs-i18n';
import { CheckExpireTokenDto } from './dto/check-expire-token.dto';
import dayjs from 'dayjs';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { templateResetPassword } from 'src/templates/mails/reset-password';
import { MSG } from 'src/constants/constant';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private usersService: MemberService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async login(body: LoginDto) {
    const member = await this.usersService.findOneByStaffcode(body.staffcode);
    if (!member) {
      throw new BadRequestException(MSG.LOGIN_FAILED);
    }
    const isSamePassword = await bcrypt.compare(body.password, member?.password);
    if (!isSamePassword) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: member.id,
      name: member.name,
      kana: member.kana,
      email: member.email,
      note: member.note,
      startdate: member.startdate,
      disabled: member.disabled,
      authority: member.authority,
      branchcode: member.branchcode,
      teamcode: member.teamcode,
      enddate: member.enddate,
      created: member.created,
      updated: member.updated,
      staffCode: member.staffcode,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const member = await this.usersService.getStaffByEmail(body.email);
    if (!member) throw new NotFoundException();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const token = uuidv4();
      const date = new Date();
      const tokenExpiration = new Date(date.setDate(date.getDate() + 1));
      member.token_expiration = tokenExpiration;
      member.reset_password_token = token;
      member.used_token = false;
      await queryRunner.manager.save(member);
      await this.sendEmail(member);
      await queryRunner.commitTransaction();
      return this.responseOk();
    } catch (err) {
      this.logger.debug('Forgot password faild', err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(this.i18n.t('messages.auth.forgotPassword.error.faild'));
    } finally {
      await queryRunner.release();
    }
  }

  async sendEmail(member: Member) {
    try {
      const url = `${process.env.WEB_URL}/reset-password?token=${member.reset_password_token}`;
      const info = await mailConfig().sendMail(templateResetPassword(url, member.email));
      this.logger.debug('Message sent: %s', info.messageId);
    } catch (err) {
      this.logger.debug('Send email faild', err);
      throw new BadRequestException(this.i18n.t('messages.auth.forgotPassword.error.faild'));
    }
  }

  async checkExpireToken(query: CheckExpireTokenDto) {
    const member = await this.usersService.getStaffByToken(query.token);

    if (!member) {
      throw new BadRequestException(this.i18n.t('messages.member.existToken'));
    }

    const today = dayjs();
    const tokenExpiration = dayjs(member.token_expiration);
    if (member.used_token) {
      throw new BadRequestException(this.i18n.t('messages.member.tokenUsed'));
    }
    if (tokenExpiration.isBefore(today)) {
      throw new BadRequestException(this.i18n.t('messages.member.tokenExpired'));
    }

    return this.responseOk();
  }

  async resetPassword(body: ResetPasswordDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const member = await this.usersService.getStaffByToken(body.token);
    if (!member) {
      throw new BadRequestException(this.i18n.t('messages.member.existToken'));
    }

    member.password = await bcrypt.hash(body.password, 10);
    member.used_token = true;
    try {
      await queryRunner.manager.save(member);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Reset password faild', err);
      throw new BadRequestException(this.i18n.t('messages.auth.resetPassword.error.faild'));
    } finally {
      await queryRunner.release();
    }
  }
}
