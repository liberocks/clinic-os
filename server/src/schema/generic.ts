import { z } from "zod";

// Schema for params object with UUID id
export const ParamsWithIdSchema = z.object({
  id: z.string().uuid(),
});
