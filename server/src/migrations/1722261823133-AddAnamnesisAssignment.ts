import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnamnesisAssignment1722261823133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create new anamnesis_assignment table
    await queryRunner.query(`
      CREATE TABLE "anamnesis_assignment" (
      		"id" character varying NOT NULL,
					"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "user_id" character varying NOT NULL,
          "form_id" character varying NOT NULL,
          "status" character varying NOT NULL
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the anamnesis_assignment table
    await queryRunner.dropTable("anamnesis_assignment");
  }
}
