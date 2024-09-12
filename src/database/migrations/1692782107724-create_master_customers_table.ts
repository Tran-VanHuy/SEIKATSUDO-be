import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMasterCustomerTable1692782107724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'master_customers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_code',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '顧客コード(parent)',
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
            comment: '顧客ID(parent)',
          },
          {
            name: 'child_code',
            type: 'varchar',
            length: '5',
            isNullable: true,
            comment: 'コード (children)',
          },
          {
            name: 'child_name',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '区分 (children)',
          },
          {
            name: 'is_update',
            type: 'int',
            length: '1',
          },
          {
            name: 'created',
            type: 'datetime',
            default: 'now()',
            comment: 'ﾚｺｰﾄﾞ作成日',
          },
          {
            name: 'updated',
            type: 'datetime',
            default: 'now()',
            comment: 'ﾚｺｰﾄﾞ更新日',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('master_customers', true);
  }
}
