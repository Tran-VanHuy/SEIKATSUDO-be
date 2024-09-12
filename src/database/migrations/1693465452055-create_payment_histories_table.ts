import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentHistoryTable1693465452055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_histories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: '出荷コード',
          },
          {
            name: 'newest_sale_id',
            type: 'varchar',
            length: '20',
            comment: '最新売上伝票コード',
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '16',
            comment: '顧客コード',
          },
          {
            name: 'sub_total',
            type: 'int',
            comment: '売上合計',
          },
          {
            name: 'fee',
            type: 'int',
            comment: '手数料',
          },
          {
            name: 'total',
            type: 'int',
            comment: '支払総合計',
          },
          {
            name: 'deposit',
            type: 'int',
            comment: '頭金',
          },
          {
            name: 'remaining',
            type: 'int',
            comment: '残金',
          },
          {
            name: 'payment_plan_number',
            type: 'int',
            default: 10,
            comment: '支払予定回数',
          },
          {
            name: 'payment_type',
            type: 'varchar',
            default: 1,
            comment: '債権方法:振込(1),カード(2),代引き(3)',
          },
          {
            name: 'payment_limit',
            type: 'datetime',
            isNullable: true,
            comment: '債権期日',
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
    await queryRunner.dropTable('payment_histories', true);
  }
}
