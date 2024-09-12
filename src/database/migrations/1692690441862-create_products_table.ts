import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductTable1692690441862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '16',
            isPrimary: true,
            comment: 'コード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '40',
            comment: '商品名',
          },
          {
            name: 'kana',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '商品名ｶﾅ',
          },
          {
            name: 'sizename',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '規格/寸法/型番',
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '6',
            isNullable: true,
            comment: '単位',
          },
          {
            name: 'jancode',
            type: 'varchar',
            length: '13',
            isNullable: true,
            comment: 'JANコード',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '20',
            comment: 'カテゴリー',
          },
          {
            name: 'type1',
            type: 'tinyint',
            comment: '区分1',
          },
          {
            name: 'type2',
            type: 'tinyint',
            isNullable: true,
            comment: '区分2',
          },
          {
            name: 'type3',
            type: 'tinyint',
            isNullable: true,
            comment: '区分3',
          },
          {
            name: 'type4',
            type: 'tinyint',
            isNullable: true,
            comment: '区分4',
          },
          {
            name: 'type5',
            type: 'tinyint',
            isNullable: true,
            comment: '区分5',
          },
          {
            name: 'stockctrl',
            type: 'tinyint',
            comment: '在庫管理:有効(1), 無効(0)',
          },
          {
            name: 'taxtype',
            type: 'tinyint',
            comment: '課税区分',
          },
          {
            name: 'unitprice',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '標準売価',
          },
          {
            name: 'unitcost',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '原価単価',
          },
          {
            name: 'cycle',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '消費サイクル',
          },
          {
            name: 'is_disabled',
            type: 'tinyint',
            isNullable: true,
            comment: '使用停止フラグ',
          },
          {
            name: 'print_name',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '印刷用名称',
          },
          {
            name: 'correct_amount',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '適正在庫数量',
          },
          {
            name: 'short_name',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '商品名略称',
          },
          {
            name: 'tax',
            type: 'int',
            isNullable: true,
            comment: '',
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
    await queryRunner.dropTable('products', true);
  }
}
