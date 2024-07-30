import type { z } from "zod";

import type { GetEntitiesQuerySchema, IdSchema, IdsSchema, PaginatedResultSchema } from "../schema/generic";

export type ParamsWithId = z.infer<typeof IdSchema>;
export type ParamsWithIds = z.infer<typeof IdsSchema>;

// Dto for pagination
export type GetEntitiesQuery = z.infer<typeof GetEntitiesQuerySchema>;
export type PaginatedResult<T> = z.infer<ReturnType<typeof PaginatedResultSchema<z.ZodType<T>>>>;
