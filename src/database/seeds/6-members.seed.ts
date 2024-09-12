import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Member, TableName } from '../../entities/member.entity';

export default class MemberSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const bcrypt = require('bcrypt');
      const password = await bcrypt.hash('samapi', 10); // bcrypt hash password
      const members = [
        {
          id: 1,
          name: 'Admin one',
          staffcode: '00001',
          email: 'admin@gmail.com',
          password: password,
          authority: 3,
        },
        {
          id: 2,
          name: 'Admin two',
          staffcode: '00002',
          email: 'user1@gmail.com',
          password: password,
          authority: 3,
        },
      ];
      await dataSource.createQueryBuilder().insert().into<Member>(TableName).values(members).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
