import { BaseEntity, Customer, Order } from "@medusajs/medusa";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { AnamnesisResponseItem } from "../types/anamnesis";
import { AnamnesisFormModel } from "./anamnesis-form";

@Entity({ name: "anamnesis_response" })
@Index("idx_anamnesis_response_form_id", ["form_id"])
@Index("idx_anamnesis_response_customer_id", ["customer_id"])
@Index("idx_anamnesis_response_order_id", ["order_id"])
export class AnamnesisResponseModel extends BaseEntity {
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
            answer: Array.isArray(item["answer"]) ? item["answer"].map(String) : String(item["answer"] ?? ""),
          }));
        }
        return [];
      },
    },
  })
  responses: AnamnesisResponseItem[];

  @ManyToOne(
    () => AnamnesisFormModel,
    (form) => form.responses,
  )
  @JoinColumn({ name: "form_id" })
  form: AnamnesisFormModel;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order;
}
