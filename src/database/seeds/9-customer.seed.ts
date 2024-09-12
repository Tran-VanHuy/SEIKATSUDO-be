import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Customer, TableName } from '../../entities/customer.entity';

export default class CustomerSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const customers = [
        {
          id: '1',
          name: '田中',
          kana: 'やまだ',
          publish: '2023-08-24 03:06:01',
          sendaddr: 1,
          zip1: '2160035',
          addr11: '神奈川県',
          addr12: '川崎市宮前区',
          addr13: '馬絹',
          telno1: '0123456789',
          areaCode: '7',
          staffcode: '00001',
        },
        {
          id: '2',
          name: '桜',
          kana: 'さくら',
          publish: '2023-08-23 03:06:01',
          sendaddr: 2,
          zip1: '0790177',
          addr11: '北海道',
          addr12: '美唄市',
          addr13: '上美唄町協和',
          telno1: '0147896325',
          zip2: '0790167',
          addr21: '北海道',
          addr22: '美唄市',
          addr23: '光珠内町南',
          telno2: '0142452525',
          zip3: '2991909',
          addr31: '千葉県',
          addr32: '安房郡鋸南町',
          addr33: '大六',
          telno3: '0364565664',
          areaCode: '10',
          staffcode: '00001',
        },
      ];
      await dataSource.createQueryBuilder().insert().into<Customer>(TableName).values(customers).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
