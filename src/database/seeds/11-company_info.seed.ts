import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { CompanyInfo, TableName } from '../../entities/company-info.entity';

export default class CompanyInfoSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const companyInfo = [
        {
          code: '01',
          name: 'company one',
          kana: 'company one',
          executive: 'Nhan vien A',
          zip: '0001',
          addr1: 'Ha Noi',
          addr2: 'Viet Nam',
          tel: '0123',
          taxrate: 15,
          newtaxrate: 20,
          newtaxdate: '2023-08-24 03:06:01',
          calcctrl: 1,
          termbegin: '2023-08-23 03:06:01',
          closeday: 10,
          form: 'buy',
          fracunit: 1,
          fractype: 2,
          fracctrl: 1,
          taxtype: 2,
        },
        {
          code: '02',
          name: 'company two',
          kana: 'company two',
          executive: 'Nhan vien B',
          zip: '1012',
          addr1: 'Ha Noi',
          addr2: 'Viet Nam',
          tel: '0147',
          taxrate: 15,
          newtaxrate: 20,
          newtaxdate: '2023-08-24 03:06:01',
          calcctrl: 1,
          termbegin: '2023-08-23 03:06:01',
          closeday: 10,
          form: 'buy',
          fracunit: 1,
          fractype: 2,
          fracctrl: 1,
          taxtype: 2,
        },
      ];
      await dataSource.createQueryBuilder().insert().into<CompanyInfo>(TableName).values(companyInfo).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
