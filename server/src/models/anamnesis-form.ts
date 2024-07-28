import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";
import { AnamnesisResponse } from "./anamnesis-response";
import { AnamnesisSection } from "./anamnesis-section";

@Entity()
export class AnamnesisForm extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(
    () => AnamnesisSection,
    (section) => section.form,
  )
  sections: AnamnesisSection[];

  @OneToMany(
    () => AnamnesisResponse,
    (response) => response.form,
  )
  responses: AnamnesisResponse[];
}

export type NewAnamnesisForm = Omit<AnamnesisForm, "created_at" | "updated_at">;
