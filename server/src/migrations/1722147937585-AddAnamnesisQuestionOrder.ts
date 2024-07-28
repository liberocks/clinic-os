import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnamnesisQuestionOrder1722147937585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add order column to anamnesis_question
    await queryRunner.query(`ALTER TABLE "anamnesis_question" ADD COLUMN "order" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop order column from anamnesis_question
    await queryRunner.query(`ALTER TABLE "anamnesis_question" DROP COLUMN "order"`);
  }
}
