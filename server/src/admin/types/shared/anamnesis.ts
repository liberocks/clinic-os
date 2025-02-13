export const ANAMNESIS_QUERY_KEY = ["anamnesis"];

export interface CreateAnamnesisQuestionPayload {
  question_text: string;
  question_type: AnamnesisQuestionType;
  options: AnamnesisQuestionOption[] | null;
}

export interface CreateAnamnesisSectionPayload {
  title: string;
  description: string;
  order: number;
  questions?: CreateAnamnesisQuestionPayload[];
}

export interface CreateAnamnesisFormPayload {
  title: string;
  description: string;
  sections?: CreateAnamnesisSectionPayload[];
}

export interface UpdateAnamnesisQuestionPayload extends CreateAnamnesisQuestionPayload {
  id: string;
  section_id: string;
}

export interface UpdateAnamnesisSectionPayload extends CreateAnamnesisSectionPayload {
  id: string;
  form_id: string;
}

export interface UpdateAnamnesisFormPayload {
  title: string;
  description: string;
  sections?: UpdateAnamnesisSectionPayload[];
}

export interface CreateAnamnesisFormResponse {
  formId: string;
}

export type UpdateAnamnesisFormResponse = CreateAnamnesisFormResponse;

export enum AnamnesisQuestionType {
  SHORT_ANSWER = "short_answer",
  LONG_ANSWER = "long_answer",
  DATE = "date",
  DATE_TIME = "date_time",
  TIME = "time",
  MULTIPLE_CHOICE = "multiple_choice",
  SELECT = "select",
}

export interface AnamnesisQuestionOption {
  label: string;
  value: string;
}

export interface AnamnesisResponseItem {
  question_id: string;
  // most of the time answer type will be a string. But in case of multiple choice, it will be an array of strings
  answer: string | string[];
}

export interface AnamnesisQuestionData {
  id: string;
  section_id: string;
  question_text: string;
  order: number;
  question_type: AnamnesisQuestionType;
  options: AnamnesisQuestionOption[] | null;
}

export interface AnamnesisSectionData {
  id: string;
  form_id?: string;
  title: string;
  description: string;
  order: number;
  questions: AnamnesisQuestionData[];
}
