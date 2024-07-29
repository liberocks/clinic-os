import type { UniqueIdentifier } from "@dnd-kit/core";

export const PLACEHOLDER_ID = "placeholder";
export const empty: UniqueIdentifier[] = [];

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
