import { BaseEntity } from "@medusajs/medusa";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AnamnesisForm } from "./anamnesis-form";
import { AnamnesisQuestion } from "./anamnesis-question";

@Entity()
export class AnamnesisSection extends BaseEntity {
	@Column()
	form_id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	order: number;

	@ManyToOne(
		() => AnamnesisForm,
		(form) => form.sections,
	)
	@JoinColumn({ name: "form_id" })
	form: AnamnesisForm;

	@OneToMany(
		() => AnamnesisQuestion,
		(question) => question.section,
	)
	questions: AnamnesisQuestion[];
}
