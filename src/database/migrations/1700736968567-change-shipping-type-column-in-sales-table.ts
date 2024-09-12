import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeShippingTypeColumnInSalesTable1700736968567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipping_type',
          type: 'int',
          comment: '発送区分',
        }),
        newColumn: new TableColumn({
          name: 'shipping_type',
          type: 'varchar',
          length: '5',
          comment: '発送区分',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipping_type',
          type: 'varchar',
          length: '5',
          comment: '発送区分',
        }),
        newColumn: new TableColumn({
          name: 'shipping_type',
          type: 'int',
          comment: '発送区分',
        }),
      },
    ]);
  }
}
