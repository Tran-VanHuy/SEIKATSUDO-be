import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { ProductTypes, TableName } from '../../entities/product-type.entity';

export default class ProductTypeSeeder implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productTypes = [
        {
          id: 1,
          name: 'Type001',
        },
        {
          id: 2,
          name: 'Type002',
        },
        {
          id: 3,
          name: 'Type003',
        },
      ];
      await dataSource.createQueryBuilder().insert().into<ProductTypes>(TableName).values(productTypes).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
