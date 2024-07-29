import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AnamnesisFormModel } from "./anamnesis-form";
import { AnamnesisQuestionModel } from "./anamnesis-question";

@Entity({ name: "anamnesis_section" })
@Index("idx_anamnesis_section_form_id", ["form_id"])
export class AnamnesisSectionModel extends BaseEntity {
  @Column()
  form_id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  order: number;

  @ManyToOne(
    () => AnamnesisFormModel,
    (form) => form.sections,
  )
  @JoinColumn({ name: "form_id" })
  form: AnamnesisFormModel;

  @OneToMany(
    () => AnamnesisQuestionModel,
    (question) => question.section,
  )
  questions: AnamnesisQuestionModel[];
}
