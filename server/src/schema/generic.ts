import { z } from "zod";

// Helper function to convert string to number
export const toNumber = (val: unknown) => (typeof val === "string" ? Number(val) : val);

// Schema for params object with UUID id
export const IdSchema = z.object({
  id: z.string(),
});

// Schema for object with list of UUID id
export const IdsSchema = z.object({
  ids: z.array(z.string()),
});

// Schema for pagination object
export const PaginationSchema = z.object({
  page: z.preprocess(toNumber, z.number().int().positive()),
  limit: z.preprocess(toNumber, z.number().int().positive()),
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
    currentPage: z.preprocess(toNumber, z.number().int().positive()),
    limit: z.preprocess(toNumber, z.number().int().positive()),
    totalItems: z.preprocess(toNumber, z.number().int().nonnegative()),
    totalPages: z.preprocess(toNumber, z.number().int().positive()),
  });

// Common schema for ID and timestamps
export const IdTimestampSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});
