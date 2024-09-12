import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeDataTypeColumnType1Type2Type3Type4Type1698745044934 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({
          name: 'type1',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          comment: '区分1',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type2',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type2',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分2',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type3',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type3',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type4',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type4',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type5',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type5',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({
          name: 'type1',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type1',
          type: 'varchar',
          length: '20',
          comment: '区分1',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type2',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type2',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分2',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type3',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type3',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type4',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type4',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'type5',
          type: 'tinyint',
          comment: '区分1',
        }),
        newColumn: new TableColumn({
          name: 'type5',
          type: 'varchar',
          length: '20',
          isNullable: true,
          comment: '区分3',
        }),
      },
    ]);
  }
}
