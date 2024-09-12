import { Column, MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsAndDeleteCustomersTable1702375401883 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('customers', [
      {
        oldColumn: new TableColumn({
          name: 'staffcode',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '社員番号',
        }),
        newColumn: new TableColumn({
          name: 'staffcode',
          type: 'varchar',
          length: '5',
          comment: '社員番号',
        }),
      },
    ]);

    await queryRunner.addColumns('customers', [
      new TableColumn({
        name: 'category',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'product',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'update_customer',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'customer_refe_id',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'shipping_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'my_self_talk',
        type: 'boolean',
        isNullable: true,
        default: false,
      }),
      new TableColumn({
        name: 'my_wife_talk',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'other_talk',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'text_other_talk',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'my_self_drink',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'my_wife_drink',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'other_drink',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'text_other_drink',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'legs_hips',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'blood_ressure',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'pedigree',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'insomnia',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'other_symptoms',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'other_symptoms_text',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'medicines_foods_text',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'job',
        type: 'varchar',
        isNullable: true,
        length: '5',
      }),
      new TableColumn({
        name: 'assigned_person',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'son',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'daughter',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'wife',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'father',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'mother',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'etc',
        type: 'boolean',
        default: false,
        isNullable: true,
      }),
      new TableColumn({
        name: 'total',
        type: 'varchar',
        length: '5',
        isNullable: true,
      }),
    ]);

    await queryRunner.dropColumns('customers', [
      'befdist_staff',
      'faxno',
      'telnum',
      'shortTel',
      'procType',
      'prtType',
      'PrnFormat',
      'assigneddate',
      'inputdate',
      'cust_status',
      'return_date',
      'age_kbn',
      'telnum02',
      'dist_code',
      'sendaddr',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('customers', [
      'category',
      'product',
      'update_customer',
      'customer_refe_id',
      'my_self_talk',
      'my_wife_talk',
      'other_talk',
      'text_other_talk',
      'my_self_drink',
      'my_wife_drink',
      'other_drink',
      'text_other_drink',
      'legs_hips',
      'blood_ressure',
      'pedigree',
      'insomnia',
      'other_symptoms',
      'other_symptoms_text',
      'medicines_foods_text',
      'job',
      'assigned_person',
      'son',
      'daughter',
      'wife',
      'father',
      'mother',
      'etc',
      'total',
      'shipping_date',
    ]);

    await queryRunner.changeColumns('customers', [
      {
        oldColumn: new TableColumn({
          name: 'staffcode',
          type: 'varchar',
          length: '5',
          isNullable: true,
          comment: '社員番号',
        }),
        newColumn: new TableColumn({
          name: 'staffcode',
          type: 'varchar',
          length: '5',
          comment: '社員番号',
        }),
      },
    ]);

    await queryRunner.addColumns('customers', [
      new TableColumn({
        name: 'befdist_staff',
        type: 'varchar',
        length: '5',
        isNullable: true,
        comment: '前配布担当者コード',
      }),
      new TableColumn({
        name: 'faxno',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: 'FAX番号-未使用',
      }),
      new TableColumn({
        name: 'telnum',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: '検索用TEL',
      }),
      new TableColumn({
        name: 'shortTel',
        type: 'varchar',
        length: '4',
        isNullable: true,
        comment: '電話番号下4桁',
      }),
      new TableColumn({
        name: 'procType',
        type: 'tinyint',
        isNullable: true,
        comment: '売掛処理方式',
      }),
      new TableColumn({
        name: 'prtType',
        type: 'tinyint',
        isNullable: true,
        comment: '請求書の発行',
      }),
      new TableColumn({
        name: 'PrnFormat',
        type: 'tinyint',
        isNullable: true,
        comment: '印刷形式',
      }),
      new TableColumn({
        name: 'assigneddate',
        type: 'datetime',
        isNullable: true,
        comment: '担当開始日',
      }),
      new TableColumn({
        name: 'inputdate',
        type: 'datetime',
        isNullable: true,
        comment: '入力日付',
      }),
      new TableColumn({
        name: 'cust_status',
        type: 'tinyint',
        isNullable: true,
        comment: '状態',
      }),
      new TableColumn({
        name: 'return_date',
        type: 'datetime',
        isNullable: true,
        comment: '返却日',
      }),
      new TableColumn({
        name: 'age_kbn',
        type: 'varchar',
        length: '2',
        isNullable: true,
        comment: '年代',
      }),
      new TableColumn({
        name: 'telnum02',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: '電話番号検索用TEL',
      }),
      new TableColumn({
        name: 'dist_code',
        type: 'varchar',
        length: '10',
        isNullable: true,
        comment: '管理ｶｰﾄﾞ配布担当者コード',
      }),
      new TableColumn({
        name: 'sendaddr',
        type: 'tinyint',
        isNullable: true,
        comment: '配送先指定フラグ',
      }),
    ]);
  }
}
