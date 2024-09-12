import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductCategoryTable1697184891146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_category',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '10',
            isPrimary: true,
            comment: 'コード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '40',
            comment: '区分名',
          },
          {
            name: 'product_text',
            type: 'varchar',
            length: '40',
            comment: '区分名',
          },
          {
            name: 'product_type',
            type: 'int',
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
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_category', true);
  }
}
