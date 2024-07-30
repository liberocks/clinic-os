import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnamnesis1722075061143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create AnamnesisForm table
    await queryRunner.query(`
			CREATE TABLE "anamnesis_form" (
					"id" character varying NOT NULL,
					"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"title" character varying NOT NULL,
					"description" character varying NOT NULL,
					CONSTRAINT "PK_anamnesis_form" PRIMARY KEY ("id")
			)
	`);
    await queryRunner.query(`CREATE INDEX "idx_anamnesis_form_id" ON "anamnesis_form" ("id")`);

    // Create AnamnesisSection table
    await queryRunner.query(`
			CREATE TABLE "anamnesis_section" (
					"id" character varying NOT NULL,
					"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"form_id" character varying NOT NULL,
					"title" character varying NOT NULL,
					"description" character varying NOT NULL,
					"order" integer NOT NULL,
					CONSTRAINT "PK_anamnesis_section" PRIMARY KEY ("id")
			)
	`);
    await queryRunner.query(`CREATE INDEX "idx_anamnesis_section_form_id" ON "anamnesis_section" ("form_id")`);

    // Create AnamnesisQuestion table
    await queryRunner.query(`
			CREATE TABLE "anamnesis_question" (
					"id" character varying NOT NULL,
					"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"section_id" character varying NOT NULL,
					"question_text" character varying NOT NULL,
					"question_type" character varying NOT NULL,
					"options" jsonb,
					CONSTRAINT "PK_anamnesis_question" PRIMARY KEY ("id")
			)
	`);
    await queryRunner.query(`CREATE INDEX "idx_anamnesis_question_section_id" ON "anamnesis_question" ("section_id")`);

    // Create AnamnesisResponse table
    await queryRunner.query(`
			CREATE TABLE "anamnesis_response" (
					"id" character varying NOT NULL,
					"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
					"customer_id" character varying NOT NULL,
          "order_id" character varying DEFAULT NULL,
					"form_id" character varying NOT NULL,
					"responses" jsonb NOT NULL,
					CONSTRAINT "PK_anamnesis_response" PRIMARY KEY ("id")
			)
	`);
    await queryRunner.query(`CREATE INDEX "idx_anamnesis_response_form_id" ON "anamnesis_response" ("form_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_anamnesis_response_customer_id" ON "anamnesis_response" ("customer_id")`,
    );

    // Add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "anamnesis_section" ADD CONSTRAINT "FK_anamnesis_section_form" FOREIGN KEY ("form_id") REFERENCES "anamnesis_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamnesis_question" ADD CONSTRAINT "FK_anamnesis_question_section" FOREIGN KEY ("section_id") REFERENCES "anamnesis_section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamnesis_response" ADD CONSTRAINT "FK_anamnesis_response_form" FOREIGN KEY ("form_id") REFERENCES "anamnesis_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamnesis_response" ADD CONSTRAINT "FK_anamnesis_response_customer" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints
    await queryRunner.query(`ALTER TABLE "anamnesis_response" DROP CONSTRAINT "FK_anamnesis_response_customer"`);
    await queryRunner.query(`ALTER TABLE "anamnesis_response" DROP CONSTRAINT "FK_anamnesis_response_form"`);
    await queryRunner.query(`ALTER TABLE "anamnesis_question" DROP CONSTRAINT "FK_anamnesis_question_section"`);
    await queryRunner.query(`ALTER TABLE "anamnesis_section" DROP CONSTRAINT "FK_anamnesis_section_form"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "idx_anamnesis_response_customer_id"`);
    await queryRunner.query(`DROP INDEX "idx_anamnesis_response_form_id"`);
    await queryRunner.query(`DROP INDEX "idx_anamnesis_question_section_id"`);
    await queryRunner.query(`DROP INDEX "idx_anamnesis_section_form_id"`);
    await queryRunner.query(`DROP INDEX "idx_anamnesis_form_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "anamnesis_response"`);
    await queryRunner.query(`DROP TABLE "anamnesis_question"`);
    await queryRunner.query(`DROP TABLE "anamnesis_section"`);
    await queryRunner.query(`DROP TABLE "anamnesis_form"`);
  }
}
