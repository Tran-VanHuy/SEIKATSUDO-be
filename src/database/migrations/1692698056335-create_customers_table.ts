import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomerTable1692693499613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
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
            isNullable: true,
            comment: '顧客名',
          },
          {
            name: 'kana',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '顧客ﾌﾘｶﾞﾅ',
          },
          {
            name: 'publish',
            type: 'datetime',
            isNullable: true,
            comment: '登録年月日',
          },
          {
            name: 'sendaddr',
            type: 'tinyint',
            isNullable: true,
            comment: '配送先指定フラグ',
          },
          {
            name: 'zip1',
            type: 'varchar',
            length: '8',
            isNullable: true,
            comment: '自宅-郵便番号',
          },
          {
            name: 'addr11',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: '自宅-住所１',
          },
          {
            name: 'addr12',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '自宅-住所２',
          },
          {
            name: 'addr13',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '自宅-住所２',
          },
          {
            name: 'telno1',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '自宅-電話番号',
          },
          {
            name: 'zip2',
            type: 'varchar',
            length: '8',
            isNullable: true,
            comment: '送付先1-郵便番号',
          },
          {
            name: 'addr21',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: '送付先1-住所１',
          },
          {
            name: 'addr22',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '送付先1-住所２',
          },
          {
            name: 'addr23',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '住所Ⅱ-住所２',
          },
          {
            name: 'telno2',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '送付先1-電話番号',
          },
          {
            name: 'zip3',
            type: 'varchar',
            length: '8',
            isNullable: true,
            comment: '送付先2-郵便番号',
          },
          {
            name: 'addr31',
            type: 'varchar',
            length: '60',
            isNullable: true,
            comment: '送付先2-送付先2',
          },
          {
            name: 'addr32',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '送付先2-送付先2',
          },
          {
            name: 'addr33',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '住所Ⅱ-住所3',
          },
          {
            name: 'telno3',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '送付先2-電話番号',
          },
          {
            name: 'faxno',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'FAX番号-未使用',
          },
          {
            name: 'telnum',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '検索用TEL',
          },
          {
            name: 'shortTel',
            type: 'varchar',
            length: '4',
            isNullable: true,
            comment: '電話番号下4桁',
          },
          {
            name: 'birth',
            type: 'datetime',
            isNullable: true,
            comment: '生年月日',
          },
          {
            name: 'gender',
            type: 'tinyint',
            isNullable: true,
            comment: '1:男子、2:女性、3:法人、4：不明',
          },
          {
            name: 'procType',
            type: 'tinyint',
            isNullable: true,
            comment: '売掛処理方式',
          },
          {
            name: 'prtType',
            type: 'tinyint',
            isNullable: true,
            comment: '請求書の発行',
          },
          {
            name: 'PrnFormat',
            type: 'tinyint',
            isNullable: true,
            comment: '印刷形式',
          },
          {
            name: 'staffcode',
            type: 'varchar',
            length: '5',
            isNullable: true,
            comment: '社員番号',
          },
          {
            name: 'assigneddate',
            type: 'datetime',
            isNullable: true,
            comment: '担当開始日',
          },
          {
            name: 'note1',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: 'メモ①',
          },
          {
            name: 'note2',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: 'メモ②',
          },
          {
            name: 'disabled',
            type: 'tinyint',
            isNullable: true,
            comment: '使用停止フラグ',
          },
          {
            name: 'attention',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '備考',
          },
          {
            name: 'inputdate',
            type: 'datetime',
            isNullable: true,
            comment: '入力日付',
          },
          {
            name: 'cust_status',
            type: 'tinyint',
            isNullable: true,
            comment: '状態',
          },
          {
            name: 'return_date',
            type: 'datetime',
            isNullable: true,
            comment: '返却日',
          },
          {
            name: 'befdist_staff',
            type: 'varchar',
            length: '5',
            isNullable: true,
            comment: '前配布担当者コード',
          },
          {
            name: 'parents_code',
            type: 'varchar',
            length: '16',
            isNullable: true,
            comment: '親コード',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: 'E-Mail',
          },
          {
            name: 'imode',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: '携帯メール',
          },
          {
            name: 'dissend_dm',
            type: 'tinyint',
            isNullable: true,
            comment: 'ＤＭ区分',
          },
          {
            name: 'dissend_tel',
            type: 'tinyint',
            isNullable: true,
            comment: 'TEL区分',
          },
          {
            name: 'age_kbn',
            type: 'varchar',
            length: '2',
            isNullable: true,
            comment: '年代',
          },
          {
            name: 'telnum02',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '電話番号検索用TEL',
          },
          {
            name: 'dist_code',
            type: 'varchar',
            length: '10',
            isNullable: true,
            comment: '管理ｶｰﾄﾞ配布担当者コード',
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
    await queryRunner.dropTable('customers', true);
  }
}
