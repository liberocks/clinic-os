import { BaseEntity } from "@medusajs/medusa";

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import {
	type AnamnesisQuestionOption,
	AnamnesisQuestionType,
} from "src/types/anamnesis";

import { AnamnesisSection } from "./anamnesis-section";

@Entity()
export class AnamnesisQuestion extends BaseEntity {
	@Column()
	section_id: string;

	@Column()
	question_text: string;

	@Column({
		type: "enum",
		enum: AnamnesisQuestionType,
		default: AnamnesisQuestionType.SHORT_ANSWER,
	})
	question_type: AnamnesisQuestionType;

	@Column({
		type: "jsonb",
		nullable: true,
		transformer: {
			to: (value: AnamnesisQuestionOption[] | null): object[] | null => {
				return value?.map((option) => ({ ...option })) ?? null;
			},
			from: (value: object[] | null): AnamnesisQuestionOption[] | null => {
				if (Array.isArray(value)) {
					return value.map((item) => ({
						label: String(item["label"] ?? ""),
						value: String(item["value"] ?? ""),
					}));
				}
				return null;
			},
		},
	})
	options: AnamnesisQuestionOption[] | null;

	@ManyToOne(
		() => AnamnesisSection,
		(section) => section.questions,
	)
	@JoinColumn({ name: "section_id" })
	section: AnamnesisSection;
}
