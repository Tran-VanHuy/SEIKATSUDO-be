import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { ShippingCompany } from '../../entities/shipping-company.entity';

export default class shippingCompanySeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const shippingCompanies = [
        {
          id: '00007',
          name: 'ゆうパック',
        },
        {
          id: '00008',
          name: '佐川',
        },
      ];

      await queryRunner.manager.insert(ShippingCompany, shippingCompanies);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
