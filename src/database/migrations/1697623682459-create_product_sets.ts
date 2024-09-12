import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductSetsTable1697623682459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_sets',
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
            name: 'sub_total',
            type: 'int',
            comment: '小計',
          },
          {
            name: 'tax',
            type: 'int',
            comment: '内消費税',
          },
          {
            name: 'discount',
            type: 'int',
            isNullable: true,
            comment: '割引',
          },
          {
            name: 'total_set',
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
    await queryRunner.dropTable('product_types', true);
  }
}
