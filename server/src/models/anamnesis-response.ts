import { BaseEntity, Customer, Order } from "@medusajs/medusa";

import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import type { AnamnesisResponseItem } from "../types/anamnesis";
import { AnamnesisForm } from "./anamnesis-form";

@Entity()
@Index("idx_anamnesis_response_form_id", ["form_id"])
@Index("idx_anamnesis_response_customer_id", ["customer_id"])
@Index("idx_anamnesis_response_order_id", ["order_id"])
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

	@ManyToOne(() => Customer)
	@JoinColumn({ name: "customer_id" })
	customer: Customer;

	@ManyToOne(() => Order)
	@JoinColumn({ name: "order_id" })
	order: Order;
}
