import { Column, MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddResetPasswordTokenInMembersTable1698888618102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'members',
      new TableColumn({
        name: 'reset_password_token',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'members',
      new TableColumn({
        name: 'token_expiration',
        type: 'datetime',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'members',
      new TableColumn({
        name: 'used_token',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('members', 'reset_password_token');
    await queryRunner.dropColumn('members', 'token_expiration');
    await queryRunner.dropColumn('members', 'used_token');
  }
}
