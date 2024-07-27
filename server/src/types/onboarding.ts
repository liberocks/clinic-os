import type { OnboardingState } from "../models/onboarding";

export type UpdateOnboardingStateInput = {
	current_step?: string;
	is_complete?: boolean;
	product_id?: string;
};

export type AdminOnboardingUpdateStateReq = {};

export type OnboardingStateRes = {
	status: OnboardingState;
};
