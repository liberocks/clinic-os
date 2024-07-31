export enum AnamnesisQuestionType {
  SHORT_ANSWER = "short_answer",
  LONG_ANSWER = "long_answer",
  DATE = "date",
  DATE_TIME = "date_time",
  TIME = "time",
  MULTIPLE_CHOICE = "multiple_choice",
  SELECT = "select",
}

// Interface for Option
export interface Option {
  label: string;
  value: string;
}

// Interface for timestamp
export interface Timestamp {
  created_at: Date;
  updated_at: Date;
}

// Interface for IdTimestamp
export interface IdTimestamp extends Timestamp {
  id: string;
}

// Interface for AnamnesisQuestion
export interface AnamnesisQuestion extends IdTimestamp {
  id: string;
  created_at: Date;
  updated_at: Date;
  question_text: string;
  question_type: AnamnesisQuestionType;
  order: number;
  options: Option[] | null;
  section_id: string;
}

// Interface for AnamnesisSection
export interface AnamnesisSection extends IdTimestamp {
  title: string;
  description: string;
  order: number;
  questions?: AnamnesisQuestion[];
  form_id: string;
}

// Interface for AnamnesisForm
export interface AnamnesisForm extends IdTimestamp {
  title: string;
  description: string;
  status?: string;
  sections?: AnamnesisSection[];
}

export interface CreateAnamnesisResponse {
  form_id: string;
  order_id?: string;
  responses: {
    question_id?: string;
    answer?: string | string[];
  }[];
}
