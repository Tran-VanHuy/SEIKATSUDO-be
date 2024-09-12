import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductTypesTable1692692210326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_types',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'コード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '40',
            comment: '区分名',
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
          {
            name: 'deleted',
            type: 'datetime',
            isNullable: true,
            comment: 'ﾚｺｰﾄﾞ更新日',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_types', true);
  }
}
