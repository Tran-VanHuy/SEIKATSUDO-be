import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShippingStatusTable1692780020728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: '配送先コード',
          },
          {
            name: 'sale_id',
            type: 'varchar',
            length: '20',
            comment: '売上伝票コード',
          },
          {
            name: 'delivery_date',
            type: 'datetime',
            comment: 'お届け先_商品到着日',
          },
          {
            name: 'delivery_time',
            type: 'tinyint',
            comment: 'お届け先_時間帯:午前中(1),午後中(2)',
          },
          {
            name: 'delivery_tel',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'お届け先_TEL',
          },
          {
            name: 'customer_address_id',
            type: 'tinyint',
            comment: '届け先選択',
          },
          {
            name: 'delivery_name',
            type: 'varchar',
            length: '80',
            isNullable: true,
            comment: 'お届け先_名前',
          },
          {
            name: 'delivery_zip',
            type: 'varchar',
            length: '8',
            isNullable: true,
            comment: 'お届け先_住所_郵便番号',
          },
          {
            name: 'delivery_address1',
            type: 'varchar',
            length: '60',
            comment: 'お届け先_住所1',
          },
          {
            name: 'delivery_address2',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: 'お届け先_住所2',
          },
          {
            name: 'delivery_address3',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: 'お届け先_住所3',
          },
          {
            name: 'shipping_note',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '発送備考',
          },
          {
            name: 'customer_memo',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '顧客メモ',
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
            comment: '商品コード３',
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
    await queryRunner.dropTable('shipments', true);
  }
}
