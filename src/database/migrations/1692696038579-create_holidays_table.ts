import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateHolidayTable1692696038579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'holidays',
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
            name: 'year',
            type: 'int',
            comment: '年',
          },
          {
            name: 'month_day',
            type: 'varchar',
            length: '4',
            comment: '月日',
          },
          {
            name: 'fulldate',
            type: 'datetime',
            isNullable: true,
            comment: '年月日',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: '名称',
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
    await queryRunner.dropTable('holidays', true);
  }
}
