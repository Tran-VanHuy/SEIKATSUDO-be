import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeDataTypeColumnShippingCompanyId1698132766335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('shipping_companies', [
      {
        oldColumn: new TableColumn({
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
          comment: 'コード',
        }),
        newColumn: new TableColumn({
          name: 'id',
          type: 'varchar',
          length: '40',
          isPrimary: true,
          comment: 'コード',
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('shipping_companies', [
      {
        oldColumn: new TableColumn({
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
          comment: 'コード',
        }),
        newColumn: new TableColumn({
          name: 'id',
          type: 'varchar',
          length: '40',
          isPrimary: true,
          comment: 'コード',
        }),
      },
    ]);
  }
}
