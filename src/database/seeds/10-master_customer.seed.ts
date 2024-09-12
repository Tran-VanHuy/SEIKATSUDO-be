import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { MasterCustomer } from '../../entities/master-customer.entity';
import { MSG } from 'src/constants/constant';

export default class MasterCustomerSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const masterCustomers = [];
      for (let i = 1; i <= 20; i++) {
        masterCustomers.push({
          id: i,
          customer_code: MSG.SETTING_CUSTOMER_DEFAULT,
          is_update: 0,
        });
      }

      await dataSource.manager.insert(MasterCustomer, masterCustomers);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
