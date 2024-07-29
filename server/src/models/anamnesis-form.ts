import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";

import { AnamnesisResponseModel } from "./anamnesis-response";
import { AnamnesisSectionModel } from "./anamnesis-section";

@Entity({ name: "anamnesis_form" })
export class AnamnesisFormModel extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(
    () => AnamnesisSectionModel,
    (section) => section.form,
  )
  sections: AnamnesisSectionModel[];

  @OneToMany(
    () => AnamnesisResponseModel,
    (response) => response.form,
  )
  responses: AnamnesisResponseModel[];
}
