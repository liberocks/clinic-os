export interface CreateAnamnesisQuestionInput {
  question_text: string;
  question_type: AnamnesisQuestionType;
  options: AnamnesisQuestionOption[] | null;
}

export interface CreateAnamnesisSectionInput {
  title: string;
  description: string;
  order: number;
  questions: CreateAnamnesisQuestionInput[];
}

export interface CreateAnamnesisFormInput {
  title: string;
  description: string;
  sections: CreateAnamnesisSectionInput[];
}

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

export interface NewAnamnesisQuestion {
  id: string;
  section_id: string;
  question_text: string;
  order: number;
  question_type: AnamnesisQuestionType;
  options: AnamnesisQuestionOption[] | null;
}

export interface NewAnamnesisSection {
  id: string;
  title: string;
  description: string;
  order: number;
  questions: NewAnamnesisQuestion[];
}
