import { BaseEntity } from "@medusajs/medusa";

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import type { AnamnesisResponseItem } from "src/types/anamnesis";
import { AnamnesisForm } from "./anamnesis-form";

@Entity()
export class AnamnesisResponse extends BaseEntity {
	@Column()
	customer_id: string;

	@Column({ nullable: true })
	order_id: string;

	@Column()
	form_id: string;

	@Column({
		type: "jsonb",
		transformer: {
			to: (value: AnamnesisResponseItem[]): object[] => {
				return value.map((item) => ({ ...item }));
			},
			from: (value: unknown): AnamnesisResponseItem[] => {
				if (Array.isArray(value)) {
					return value.map((item) => ({
						question_id: String(item["question_id"] ?? ""),
						answer: Array.isArray(item["answer"])
							? item["answer"].map(String)
							: String(item["answer"] ?? ""),
					}));
				}
				return [];
			},
		},
	})
	responses: AnamnesisResponseItem[];

	@ManyToOne(
		() => AnamnesisForm,
		(form) => form.responses,
	)
	@JoinColumn({ name: "form_id" })
	form: AnamnesisForm;
}
