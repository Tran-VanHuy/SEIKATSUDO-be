import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAreaShipmentTable1692777758076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'area_shipments',
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
            name: 'area_id',
            type: 'int',
            comment: '発送エリアコード',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '80',
            comment: '発送エリア',
          },
          {
            name: 'days',
            type: 'int',
            isNullable: true,
            comment: '配達日数',
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: true,
            comment: '送料',
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
    await queryRunner.dropTable('area_shipments', true);
  }
}
