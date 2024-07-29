import type { z } from "zod";

import type {
  AnamnesisFormSchema,
  AnamnesisQuestionSchema,
  AnamnesisResponseSchema,
  AnamnesisSectionSchema,
  CreateAnamnesisFormSchema,
  CreateAnamnesisQuestionSchema,
  CreateAnamnesisSectionSchema,
  UpdateAnamnesisFormSchema,
  UpdateAnamnesisQuestionSchema,
  UpdateAnamnesisSectionSchema,
} from "../schema/anamnesis";

export type AnamnesisQuestionDto = z.infer<typeof AnamnesisQuestionSchema>;
export type AnamnesisSectionDto = z.infer<typeof AnamnesisSectionSchema>;
export type AnamnesisFormDto = z.infer<typeof AnamnesisFormSchema>;
export type AnamnesisResponseDto = z.infer<typeof AnamnesisResponseSchema>;

// Dto for creating new entities
export type CreateAnamnesisQuestionDto = z.infer<typeof CreateAnamnesisQuestionSchema>;
export type CreateAnamnesisSectionDto = z.infer<typeof CreateAnamnesisSectionSchema>;
export type CreateAnamnesisFormDto = z.infer<typeof CreateAnamnesisFormSchema>;

// Dto for updating entities
export type UpdateAnamnesisQuestionDto = z.infer<typeof UpdateAnamnesisQuestionSchema>;
export type UpdateAnamnesisSectionDto = z.infer<typeof UpdateAnamnesisSectionSchema>;
export type UpdateAnamnesisFormDto = z.infer<typeof UpdateAnamnesisFormSchema>;
