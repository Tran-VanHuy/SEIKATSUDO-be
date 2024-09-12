import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeShippingConfirmStaffIdColumnInSalesTable1699861429036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipping_confirm_staff_id',
          type: 'varchar',
          length: '5',
          comment: '発送確認担当者コード',
        }),
        newColumn: new TableColumn({
          name: 'shipping_confirm_staff_id',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '発送確認担当者コード',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('sales', [
      {
        oldColumn: new TableColumn({
          name: 'shipping_confirm_staff_id',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '発送確認担当者コード',
        }),
        newColumn: new TableColumn({
          name: 'shipping_confirm_staff_id',
          type: 'varchar',
          length: '5',
          comment: '発送確認担当者コード',
        }),
      },
    ]);
  }
}
