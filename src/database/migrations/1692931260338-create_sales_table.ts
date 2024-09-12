import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSaleTable1692931260338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '20',
            isPrimary: true,
            comment: '売上伝票コード',
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '16',
            comment: '顧客コード',
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '顧客名',
          },
          {
            name: 'staff_id',
            type: 'varchar',
            length: '5',
            comment: '売上担当者コード',
          },
          {
            name: 'shipping_date',
            type: 'datetime',
            comment: '発送日',
          },
          {
            name: 'shipping_check',
            type: 'tinyint',
            comment: '発送日_チェック',
          },
          {
            name: 'order_date',
            type: 'datetime',
            comment: '受付日',
          },
          {
            name: 'shipping_confirm_staff_id',
            type: 'varchar',
            length: '5',
            comment: '発送確認担当者コード',
          },
          {
            name: 'shipping_company_id',
            type: 'varchar',
            length: '5',
            comment: '配送業者コード',
          },
          {
            name: 'shipping_company_name',
            type: 'varchar',
            length: '40',
            comment: '配送業者',
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
            comment: '伝票状態: 受注(1),受注確認済(2),出荷指示済(3),出荷済(4),回収済(5),債権放棄(6),キャンセル(99)',
          },
          {
            name: 'status_change_reason',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: '伝票状態変更理由',
          },
          {
            name: 'shipping_origin_id',
            type: 'varchar',
            length: '5',
            comment: '発送元コード',
          },
          {
            name: 'shipment_staff_id',
            type: 'varchar',
            length: '5',
            comment: '出荷担当者コード',
          },
          {
            name: 'sub_total',
            type: 'int',
            comment: '小計',
          },
          {
            name: 'discount',
            type: 'int',
            comment: '割引',
          },
          {
            name: 'shipping_fee',
            type: 'int',
            comment: '割引',
          },
          {
            name: 'shipping_type',
            type: 'int',
            comment: '発送区分',
          },
          {
            name: 'total',
            type: 'int',
            comment: '売上合計',
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
    await queryRunner.dropTable('sales', true);
  }
}
