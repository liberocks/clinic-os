import type { z } from "zod";

import type {
  AnamnesisFormSchema,
  AnamnesisQuestionSchema,
  AnamnesisResponseSchema,
  AnamnesisSectionSchema,
  CreateAnamnesisFormSchema,
  CreateAnamnesisQuestionSchema,
  CreateAnamnesisSectionSchema,
} from "../schema/anamnesis";

export type AnamnesisQuestionDto = z.infer<typeof AnamnesisQuestionSchema>;
export type AnamnesisSectionDto = z.infer<typeof AnamnesisSectionSchema>;
export type AnamnesisFormDto = z.infer<typeof AnamnesisFormSchema>;
export type AnamnesisResponseDto = z.infer<typeof AnamnesisResponseSchema>;

export type CreateAnamnesisQuestionDto = z.infer<typeof CreateAnamnesisQuestionSchema>;
export type CreateAnamnesisSectionDto = z.infer<typeof CreateAnamnesisSectionSchema>;
export type CreateAnamnesisFormDto = z.infer<typeof CreateAnamnesisFormSchema>;
