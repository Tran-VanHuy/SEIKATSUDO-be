import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { AreaShipment } from '../../entities/area-shipment.entity';

export default class AreaShipmentsSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const areaShipments = [
        {
          id: 1,
          area_id: 1,
          name: '九州',
          days: 3,
          amount: 300,
        },
        {
          id: 2,
          area_id: 2,
          name: '中国',
          days: 3,
          amount: 300,
        },
        {
          id: 3,
          area_id: 3,
          name: '四国',
          days: 6,
          amount: 500,
        },
        {
          id: 4,
          area_id: 4,
          name: '近畿',
          days: 6,
          amount: 500,
        },
        {
          id: 5,
          area_id: 5,
          name: '北陸',
          days: 8,
          amount: 1200,
        },
        {
          id: 6,
          area_id: 6,
          name: '東海',
          days: 8,
          amount: 1200,
        },
        {
          id: 7,
          area_id: 7,
          name: '関東',
          days: 10,
          amount: 1500,
        },
        {
          id: 8,
          area_id: 8,
          name: '東北',
          days: 10,
          amount: 1500,
        },
        {
          id: 9,
          area_id: 10,
          name: '北海道',
          days: 12,
          amount: 1500,
        },
        {
          id: 10,
          area_id: 11,
          name: '沖縄',
          days: 8,
          amount: 1200,
        },
      ];
      await queryRunner.manager.insert(AreaShipment, areaShipments);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
