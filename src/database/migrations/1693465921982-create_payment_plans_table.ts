import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentPlanTable1693465921982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_plans',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: '支払予定コード',
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
            name: 'payment_number',
            type: 'int',
            comment: '支払回数',
          },
          {
            name: 'payment_date',
            type: 'datetime',
            comment: '支払予定日',
          },
          {
            name: 'payment_amount',
            type: 'int',
            isNullable: true,
            comment: '支払予定額',
          },
          {
            name: 'remaining',
            type: 'int',
            isNullable: true,
            comment: '残り',
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
            comment: '支払ステータス:未払(0),支払済(1)',
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
    await queryRunner.dropTable('payment_plans', true);
  }
}
