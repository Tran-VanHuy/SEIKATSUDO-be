import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateChangeTypeTable1692757910877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'change_types',
        columns: [
          {
            name: 'tabletype',
            type: 'tinyint',
            isPrimary: true,
            comment: '分類種別',
          },
          {
            name: 'lcode',
            isPrimary: true,
            type: 'varchar',
            length: '4',
            comment: '分類コード',
          },
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            length: '3',
            comment: 'コード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
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
    await queryRunner.dropTable('change_types', true);
  }
}
