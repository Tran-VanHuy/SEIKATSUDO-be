1699003456939;
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeDataTypeColumnType11699003456939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分1',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分1',
        }),
      },
    ]);
  }
}
