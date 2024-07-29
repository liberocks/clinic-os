import { z } from "zod";
import { AnamnesisQuestionType } from "../types/anamnesis";

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
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
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
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
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
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
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
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  customer_id: z.string().uuid(),
  order_id: z.string().uuid(),
  form_id: z.string().uuid(),
  responses: z.array(ResponseItemSchema),
});
