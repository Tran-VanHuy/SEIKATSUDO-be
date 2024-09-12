import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedColumnInMemberTable1697689700423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'members',
      new TableColumn({
        name: 'deleted',
        type: 'datetime',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('members', 'deleted');
  }
}
