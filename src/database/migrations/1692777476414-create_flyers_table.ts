import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFlyerTable1692777476414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'flyers',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '3',
            isPrimary: true,
            comment: 'チラシコード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '30',
            comment: 'チラシ名',
          },
          {
            name: 'note',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '備考',
          },
          {
            name: 'repeatflg',
            type: 'tinyint',
            isNullable: true,
            comment: '新規／リピートフラグ',
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
            comment: 'ﾚｺｰﾄﾞ作成日',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('flyers', true);
  }
}
