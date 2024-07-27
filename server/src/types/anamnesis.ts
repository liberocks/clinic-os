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
