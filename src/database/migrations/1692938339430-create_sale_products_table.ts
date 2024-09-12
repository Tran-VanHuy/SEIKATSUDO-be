import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSaleProductTable1692938339430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sale_products',
        columns: [
          {
            name: 'sale_id',
            type: 'varchar',
            length: '20',
            isPrimary: true,
            comment: '売上伝票コード',
          },
          {
            name: 'sort',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isPrimary: true,
            comment: '行№',
          },
          {
            name: 'type',
            type: 'tinyint',
            comment: '明細属性:受注(1),取消(2),返品(3)',
          },
          {
            name: 'product_id',
            type: 'varchar',
            length: '16',
            isPrimary: true,
            comment: '商品コード',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            comment: '数量',
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '6',
            isNullable: true,
            comment: '単位',
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 15,
            scale: 0,
            comment: 'パスワード',
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '仕入単価',
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 15,
            scale: 0,
            comment: '売上金額',
          },
          {
            name: 'subctotal',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '原価金額',
          },
          {
            name: 'subbenef',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,

            comment: '粗利額',
          },
          {
            name: 'subtax',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '消費税額',
          },
          {
            name: 'shipment_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            comment: '出荷数量',
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
            comment: 'ﾚｺｰﾄﾞ削除日',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sale_products', true);
  }
}
