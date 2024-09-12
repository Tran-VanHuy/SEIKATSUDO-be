import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AreaShipment } from 'src/entities/area-shipment.entity';
import { areaShipmentDto } from './dto/res.list.dto';
import { MSG } from 'src/constants/constant';
import { ReqAreaShipmentTransactionDto } from './dto/req.create.dto';

@Injectable()
export class AreaShipmentService extends BaseService {
  constructor(
    @InjectRepository(AreaShipment) private readonly areaShipmentRepo: Repository<AreaShipment>,
    private dataSource: DataSource,
  ) {
    super();
  }

  async findAll() {
    const areaData = await this.areaShipmentRepo.find();
    const areaRes = areaData.map((area) => new areaShipmentDto(area));
    return this.responseOk(areaRes);
  }

  async updateSale(body: ReqAreaShipmentTransactionDto, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const dataAreaShipment = {
      id: Number(id),
      area_id: body.code,
      days: body.shipmentDay,
      name: body.area,
    };

    try {
      await queryRunner.manager.update(AreaShipment, id, dataAreaShipment);
      await queryRunner.commitTransaction();

      return this.responseOk();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('update sale failed', err);
      throw new HttpException(MSG.AREA_SHIPMENT + MSG.UPDATE_FAIL, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
