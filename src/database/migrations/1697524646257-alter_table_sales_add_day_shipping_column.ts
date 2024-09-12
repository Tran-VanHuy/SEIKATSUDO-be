import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTableSalesAddDayShippingColumn1697524646257 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sales',
      new TableColumn({
        name: 'day_shipping',
        type: 'datetime',
        isNullable: true,
        comment: '出荷日',
      }),
    );

    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipment_staff_id',
          type: 'varchar',
          length: '5',
          comment: '出荷担当者コード',
        }),
        newColumn: new TableColumn({
          name: 'shipment_staff_id',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '出荷担当者コード',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales', 'day_shipping');
    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipment_staff_id',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '出荷担当者コード',
        }),
        newColumn: new TableColumn({
          name: 'shipment_staff_id',
          type: 'varchar',
          length: '5',
          comment: '出荷担当者コード',
        }),
      },
    ]);
  }
}
