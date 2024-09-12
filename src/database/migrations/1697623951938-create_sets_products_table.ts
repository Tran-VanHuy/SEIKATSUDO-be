import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSetsProductsTable1697623951938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sets_products',
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
            name: 'set_id',
            type: 'int',
            comment: '定番セットマスタ',
          },
          {
            name: 'product_id',
            type: 'varchar',
            length: '40',
            comment: '商品一覧',
          },
          {
            name: 'quantity',
            type: 'int',
            comment: '量',
          },
          {
            name: 'total',
            type: 'int',
            comment: '合計',
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
            comment: '削除されました',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sets_products', true);
  }
}
