import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { type AnamnesisQuestionOption, AnamnesisQuestionType } from "../types/anamnesis";
import { AnamnesisSectionModel } from "./anamnesis-section";

@Entity({ name: "anamnesis_question" })
@Index("idx_anamnesis_question_section_id", ["section_id"])
export class AnamnesisQuestionModel extends BaseEntity {
  @Column()
  section_id: string;

  @Column()
  question_text: string;

  @Column()
  order: number;

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
    () => AnamnesisSectionModel,
    (section) => section.questions,
  )
  @JoinColumn({ name: "section_id" })
  section: AnamnesisSectionModel;
}
