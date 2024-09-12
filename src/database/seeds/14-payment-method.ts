import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { PaymentMethods } from '../../entities/payment-method.entity';

export default class PaymentMethodsSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const paymentMethods = [
        {
          id: '00001',
          name: '振込',
        },
        {
          id: '00002',
          name: 'カード',
        },
        {
          id: '00003',
          name: '代引き',
        },
      ];

      await queryRunner.manager.insert(PaymentMethods, paymentMethods);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
