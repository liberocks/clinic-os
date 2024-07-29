import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity({ name: "anamnesis_assignment" })
export class AnamnesisAssignmentModel extends BaseEntity {
  @Column()
  user_id: string;

  @Column()
  form_id: string;

  @Column()
  status: string;
}
