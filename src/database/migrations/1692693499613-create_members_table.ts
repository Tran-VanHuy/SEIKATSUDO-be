import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMemberTable1692693499613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'members',
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
            name: 'staffcode',
            type: 'varchar',
            length: '5',
            comment: '社員番号',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '225',
            isNullable: true,
            comment: '名前',
          },
          {
            name: 'kana',
            type: 'varchar',
            length: '225',
            isNullable: true,
            comment: '名前ｶﾅ',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            comment: 'メアド→ログインID',
          },
          {
            name: 'note',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'メモ',
          },
          {
            name: 'startdate',
            type: 'datetime',
            isNullable: true,
            comment: '入社年月日',
          },
          {
            name: 'disabled',
            type: 'tinyint',
            default: 0,
            comment: '使用停止フラグ:有効(1),無効(0)',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            comment: 'パスワード',
          },
          {
            name: 'authority',
            type: 'tinyint',
            isNullable: true,
            comment: '権限',
          },
          {
            name: 'branchcode',
            type: 'varchar',
            length: '4',
            isNullable: true,
            comment: '部門コード',
          },
          {
            name: 'teamcode',
            type: 'varchar',
            length: '4',
            isNullable: true,
            comment: '支店コード',
          },
          {
            name: 'enddate',
            type: 'datetime',
            isNullable: true,
            comment: '退社年月日',
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
    await queryRunner.dropTable('members', true);
  }
}
