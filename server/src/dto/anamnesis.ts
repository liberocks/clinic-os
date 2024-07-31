import type { z } from "zod";

import type {
  AnamnesisFormSchema,
  AnamnesisQuestionSchema,
  AnamnesisResponseSchema,
  AnamnesisSectionSchema,
  CreateAnamnesisAssignmentSchema,
  CreateAnamnesisFormSchema,
  CreateAnamnesisQuestionSchema,
  CreateAnamnesisResponseSchema,
  CreateAnamnesisSectionSchema,
  UpdateAnamnesisFormSchema,
  UpdateAnamnesisQuestionSchema,
  UpdateAnamnesisSectionSchema,
} from "../schema/anamnesis";

// Dto for anamnesis entities
export type AnamnesisQuestionDto = z.infer<typeof AnamnesisQuestionSchema>;
export type AnamnesisSectionDto = z.infer<typeof AnamnesisSectionSchema>;
export type AnamnesisFormDto = z.infer<typeof AnamnesisFormSchema>;
export type AnamnesisResponseDto = z.infer<typeof AnamnesisResponseSchema>;

// Dto for creating new anamnesis
export type CreateAnamnesisQuestionDto = z.infer<typeof CreateAnamnesisQuestionSchema>;
export type CreateAnamnesisSectionDto = z.infer<typeof CreateAnamnesisSectionSchema>;
export type CreateAnamnesisFormDto = z.infer<typeof CreateAnamnesisFormSchema>;

// Dto for creating anamnesis response
export type CreateAnamnesisResponseDto = z.infer<typeof CreateAnamnesisResponseSchema>;

// Dto for updating anamnesis
export type UpdateAnamnesisQuestionDto = z.infer<typeof UpdateAnamnesisQuestionSchema>;
export type UpdateAnamnesisSectionDto = z.infer<typeof UpdateAnamnesisSectionSchema>;
export type UpdateAnamnesisFormDto = z.infer<typeof UpdateAnamnesisFormSchema>;

// Dto for anamnesis results
export type AnamnesisFormResultDto = UpdateAnamnesisFormDto & { id?: string };

// Dto for anamnesis response results
export type AnamnesisResponseResultDto = AnamnesisResponseDto;

// Dto for anamnesis assignment
export type AnamnesisAssignmentDto = z.infer<typeof CreateAnamnesisAssignmentSchema>;
