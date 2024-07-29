import { z } from "zod";

// Schema for params object with UUID id
export const ParamsWithIdSchema = z.object({
  id: z.string().uuid(),
});

// Common schema for ID and timestamps
export const IdTimestampSchema = z.object({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});
