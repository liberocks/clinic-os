import { z } from "zod";

// Schema for params object with UUID id
export const IdSchema = z.object({
  id: z.string().uuid(),
});

// Schema for object with list of UUID id
export const IdsSchema = z.object({
  ids: z.array(z.string().uuid()),
});

// Schema for pagination object
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

// Schema for sorting object
export const SortingSchema = z.object({
  field: z.string(),
  order: z.enum(["asc", "desc"]),
});

// Schema for filtering object
export const FilteringSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "neq", "gt", "lt", "gte", "lte", "like"]),
  value: z.any(),
});

// Schema for GetEntitiesQuery
export const GetEntitiesQuerySchema = z
  .object({
    // Spread the fields from PaginationSchema
    ...PaginationSchema.shape,

    // Spread the fields from SortingSchema
    ...SortingSchema.shape,

    // Add the filters array
    filters: z.array(FilteringSchema).optional(),
  })
  .partial();

// Schema for PaginatedResult
export const PaginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    currentPage: z.number().int().positive(),
    itemsPerPage: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
  });

// Common schema for ID and timestamps
export const IdTimestampSchema = z.object({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});
