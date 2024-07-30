import { z } from "zod";

import { AnamnesisQuestionType } from "../types/anamnesis";
import { IdTimestampSchema, toNumber } from "./generic";

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
  order: z.preprocess(toNumber, z.number().int()),
  options: z.array(OptionSchema).nullable(),
});

// Full AnamnesisQuestion Schema (with id and timestamps)
export const AnamnesisQuestionSchema = BaseAnamnesisQuestionSchema.extend({
  ...IdTimestampSchema.shape,
  section_id: z.string(),
});

// Base AnamnesisSection Schema (without id and timestamps)
const BaseAnamnesisSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.preprocess(toNumber, z.number().int()),
  questions: z.array(BaseAnamnesisQuestionSchema).optional(),
});

// Full AnamnesisSection Schema (with id and timestamps)
export const AnamnesisSectionSchema = BaseAnamnesisSectionSchema.extend({
  ...IdTimestampSchema.shape,
  form_id: z.string(),
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
  form_id: z.string(),
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

// Schemas for updating entities (without timestamps)
export const UpdateAnamnesisQuestionSchema = AnamnesisQuestionSchema.omit({
  created_at: true,
  updated_at: true,
}).extend({ id: z.string(), section_id: z.string() });

export const UpdateAnamnesisSectionSchema = AnamnesisSectionSchema.omit({
  created_at: true,
  updated_at: true,
  questions: true,
}).extend({
  id: z.string(),
  form_id: z.string(),
  questions: z.array(UpdateAnamnesisQuestionSchema).optional(),
});

export const UpdateAnamnesisFormSchema = AnamnesisFormSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  sections: true,
}).extend({
  sections: z.array(UpdateAnamnesisSectionSchema).optional(),
});

// Schema for AnamnesisResponse
const ResponseItemSchema = z.object({
  question_id: z.string(),
  answer: z.union([z.string(), z.array(z.string())]),
});

export const AnamnesisResponseSchema = z.object({
  ...IdTimestampSchema.shape,
  customer_id: z.string(),
  order_id: z.string(),
  form_id: z.string(),
  responses: z.array(ResponseItemSchema),
});

export const CreateAnamnesisResponseSchema = AnamnesisResponseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  form_id: true,
});
