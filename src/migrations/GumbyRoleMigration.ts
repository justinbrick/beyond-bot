import { MigrationInterface, QueryRunner } from 'typeorm';

export class GumbyRoleMigration1658077578305 implements MigrationInterface {
  async up(runner: QueryRunner) {
    await runner.query(
      'ALTER TABLE "gumby_role" ADD COLUMN permissionFlags UNSIGNED BIG INT'
    );
  }
  async down(runner: QueryRunner) {
    await runner.query('ALTER TABLE "gumby_role" DROP COLUMN permissionFlags');
  }
}
