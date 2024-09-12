import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Flyer, TableName } from '../../entities/flyer.entity';

export default class FlyerSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const flyers = [
        {
          id: '01',
          name: 'flyer one',
          note: 'phat to roi',
          repeatflg: 1,
        },
        {
          id: '02',
          name: 'flyer two',
          note: 'phat to roi 02',
          repeatflg: 1,
        },
      ];
      await dataSource.createQueryBuilder().insert().into<Flyer>(TableName).values(flyers).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
