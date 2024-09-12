1693466144726;
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReceivedTransactionTable1693466144726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'received_transactions',
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
            comment: '売上伝票コード',
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '16',
            comment: '顧客コード',
          },
          {
            name: 'payment_plan_id',
            type: 'int',
            comment: '支払予定コード',
          },
          {
            name: 'payment_number',
            type: 'int',
            comment: '支払回数',
          },
          {
            name: 'payment_date',
            type: 'datetime',
            comment: '支払日',
          },
          {
            name: 'payment_amount',
            type: 'int',
            isNullable: true,
            comment: '支払額',
          },
          {
            name: 'payment_type',
            type: 'varchar',
            default: 1,
            comment: '支払方法:振込(1),カード(2),代引き(3)',
          },
          {
            name: 'remaining',
            type: 'int',
            comment: '残金',
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
    await queryRunner.dropTable('received_transactions', true);
  }
}
