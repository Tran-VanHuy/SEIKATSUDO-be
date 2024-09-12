import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { ChangeType, TableName } from '../../entities/change-type.entity';

export default class ChangeTypeSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ChangeTypes = [
        {
          tabletype: 4,
          lcode: '0001',
          id: 'C01',
          name: 'type 01',
        },
        {
          tabletype: 2,
          lcode: '0040',
          id: 'A01',
          name: 'type A 01',
        },
      ];
      await dataSource.createQueryBuilder().insert().into<ChangeType>(TableName).values(ChangeTypes).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
