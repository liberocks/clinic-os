import { z } from "zod";

import { AnamnesisQuestionType } from "../types/anamnesis";
import { IdTimestampSchema } from "./generic";

// Enum for AnamnesisQuestionType
const AnamnesisQuestionTypeEnum = z.enum([
  AnamnesisQuestionType.SHORT_ANSWER,
  AnamnesisQuestionType.LONG_ANSWER,
  AnamnesisQuestionType.DATE,
  AnamnesisQuestionType.DATE_TIME,
  AnamnesisQuestionType.TIME,
  AnamnesisQuestionType.MULTIPLE_CHOICE,
  AnamnesisQuestionType.SELECT,
]);

// Schema for Option
const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Base AnamnesisQuestion Schema (without id and timestamps)
const BaseAnamnesisQuestionSchema = z.object({
  question_text: z.string(),
  question_type: AnamnesisQuestionTypeEnum,
  order: z.number().int(),
  options: z.array(OptionSchema).nullable(),
});

// Full AnamnesisQuestion Schema (with id and timestamps)
export const AnamnesisQuestionSchema = BaseAnamnesisQuestionSchema.extend({
  ...IdTimestampSchema.shape,
  section_id: z.string().uuid(),
});

// Base AnamnesisSection Schema (without id and timestamps)
const BaseAnamnesisSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
  questions: z.array(BaseAnamnesisQuestionSchema).optional(),
});

// Full AnamnesisSection Schema (with id and timestamps)
export const AnamnesisSectionSchema = BaseAnamnesisSectionSchema.extend({
  ...IdTimestampSchema.shape,
  form_id: z.string().uuid(),
});

// Base AnamnesisForm Schema (without id and timestamps)
const BaseAnamnesisFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(BaseAnamnesisSectionSchema).optional(),
});

// Full AnamnesisForm Schema (with id and timestamps)
export const AnamnesisFormSchema = BaseAnamnesisFormSchema.extend({
  ...IdTimestampSchema.shape,
});

// Base AnamnesisAssignmnet Schema (without id and timestamps)
const BaseAnamnesisAssignmentSchema = z.object({
  user_id: z.string(),
  form_id: z.string().uuid(),
  status: z.string(),
});

// Full AnamnesisAssignment Schema (with id and timestamps)
export const AnamnesisAssignmentSchema = BaseAnamnesisAssignmentSchema.extend({
  ...IdTimestampSchema.shape,
});

// Schemas for creating new entities (without id and timestamps)
export const CreateAnamnesisQuestionSchema = BaseAnamnesisQuestionSchema;
export const CreateAnamnesisSectionSchema = BaseAnamnesisSectionSchema;
export const CreateAnamnesisFormSchema = BaseAnamnesisFormSchema;

// Schema for AnamnesisResponse
const ResponseItemSchema = z.object({
  question_id: z.string().uuid(),
  answer: z.union([z.string(), z.array(z.string())]),
});

export const AnamnesisResponseSchema = z.object({
  ...IdTimestampSchema.shape,
  customer_id: z.string().uuid(),
  order_id: z.string().uuid(),
  form_id: z.string().uuid(),
  responses: z.array(ResponseItemSchema),
});
