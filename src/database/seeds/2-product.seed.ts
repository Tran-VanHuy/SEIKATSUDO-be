import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Product, TableName } from '../../entities/product.entity';

export default class ProductSeeder implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = [
        {
          id: '000001',
          name: 'コンピューター',
          kana: 'コンピューター',
          sizename: 'mas',
          unit: 'だい',
          jancode: '490123456789',
          category: '001',
          type1: '1001',
          stockctrl: 1,
          taxtype: 1,
          unitprice: 3000,
          unitcost: 20,
          cycle: 5,
          print_name: 'コンピューター',
          correct_amount: 20,
          short_name: 'コンピューター',
          tax: 5,
        },
        {
          id: '000002',
          name: '携帯電話',
          kana: 'けいたいでんわ',
          sizename: 'mas',
          unit: 'だい',
          jancode: '490123456777',
          category: '001',
          type1: '2001',
          stockctrl: 2,
          taxtype: 2,
          unitprice: 3000,
          unitcost: 20,
          cycle: 5,
          print_name: 'けいたいでんわ',
          correct_amount: 20,
          short_name: 'けいたいでんわ',
          tax: 8,
        },
      ];
      await dataSource.createQueryBuilder().insert().into<Product>(TableName).values(product).execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err, 'failed');
    } finally {
      await queryRunner.release();
    }
  }
}
