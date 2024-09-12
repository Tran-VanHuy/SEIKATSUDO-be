import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Holiday, TableName } from '../../entities/holiday.entity';

export default class HolidaySeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const holidays = [
        {
          id: 1,
          year: 2023,
          month_day: '0923',
          fulldate: '20230919',
        },
        {
          id: 2,
          year: 2023,
          month_day: '1009',
          fulldate: '20231009',
        },
        {
          id: 3,
          year: 2023,
          month_day: '1103',
          fulldate: '20231103',
        },
      ];
      await dataSource.createQueryBuilder().insert().into<Holiday>(TableName).values(holidays).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
