import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompanyInfoTable1692694326933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'company_infos',
        columns: [
          {
            name: 'code',
            type: 'varchar',
            length: '3',
            isPrimary: true,
            comment: '自社コード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '36',
            comment: '自社名',
          },
          {
            name: 'kana',
            type: 'varchar',
            length: '36',
            isNullable: true,
            comment: '自社名ｶﾅ',
          },
          {
            name: 'executive',
            type: 'varchar',
            length: '16',
            isNullable: true,
            comment: '代表者名',
          },
          {
            name: 'zip',
            type: 'varchar',
            length: '8',
            isNullable: true,
            comment: '郵便番号-未使用',
          },
          {
            name: 'addr1',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '住所１-未使用',
          },
          {
            name: 'addr2',
            type: 'varchar',
            length: '40',
            comment: '住所2-未使用',
          },
          {
            name: 'tel',
            type: 'varchar',
            length: '4',
            isNullable: true,
            comment: '電話番号-未使用',
          },
          {
            name: 'fax',
            type: 'varchar',
            length: '4',
            isNullable: true,
            comment: 'ＦＡＸ番号-未使用',
          },
          {
            name: 'account1',
            type: 'varchar',
            length: '5',
            isNullable: true,
            comment: '郵便局№',
          },
          {
            name: 'account2',
            type: 'tinyint',
            isNullable: true,
            comment: '郵便局口座種別',
          },
          {
            name: 'account3',
            type: 'varchar',
            length: '7',
            isNullable: true,
            comment: '郵便局口座№',
          },
          {
            name: 'taxrate',
            type: 'decimal',
            precision: 15,
            scale: 2,
            comment: '現在消費税率',
          },
          {
            name: 'newtaxrate',
            type: 'decimal',
            precision: 15,
            scale: 2,
            comment: '変更後消費税率',
          },
          {
            name: 'newtaxdate',
            type: 'datetime',
            comment: '消費税変更年月日',
          },
          {
            name: 'calcctrl',
            type: 'tinyint',
            comment: '端数処理方法',
          },
          {
            name: 'termbegin',
            type: 'datetime',
            comment: '期首日',
          },
          {
            name: 'closeday',
            type: 'decimal',
            precision: 15,
            scale: 0,
            comment: '自社締日',
          },
          {
            name: 'form',
            type: 'varchar',
            length: '6',
            comment: '敬称',
          },
          {
            name: 'fracunit',
            type: 'tinyint',
            comment: '消費税設定単位',
          },
          {
            name: 'fractype',
            type: 'tinyint',
            comment: '消費税計算単位',
          },
          {
            name: 'fracctrl',
            type: 'tinyint',
            comment: '消費税端数処理',
          },
          {
            name: 'taxtype',
            type: 'tinyint',
            comment: '課税区分',
          },
          {
            name: 'accountname',
            type: 'varchar',
            length: '40',
            isNullable: true,
            comment: '取扱郵便局名',
          },
          {
            name: 'accounttel',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '取扱郵便局電話番号',
          },
          {
            name: 'days',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '配達日数',
          },
          {
            name: 'bil_cust_cd',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '請求先顧客コード',
          },
          {
            name: 'bil_class_cd',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '請求先分類コード',
          },
          {
            name: 'fare_no',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '運賃管理番号',
          },
          {
            name: 'payday',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '支払期限期間',
          },
          {
            name: 'reg_discount_cnt',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '定期値引回数',
          },
          {
            name: 'reg_discountrate',
            type: 'decimal',
            precision: 15,
            scale: 0,
            isNullable: true,
            comment: '定期値引率',
          },
          {
            name: 'password01',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'パスワード01',
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
    await queryRunner.dropTable('company_infos', true);
  }
}
