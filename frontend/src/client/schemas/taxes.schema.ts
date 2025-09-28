import { z } from "zod"

// Base schema with all the required fields for creating/updating a tax
export const TaxBaseSchema = z.object({
  id: z.number().int().positive().optional(), // usually read-only
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  rate: z.number().positive("Rate must be positive"),
  rate_type: z.enum(["percentages", "fixed"]),
  description: z.string().optional(),
  created_at: z.string().datetime().optional(), // read-only
  updated_at: z.string().datetime().optional(), // read-only
  owner: z.number().int().positive("Owner ID must be positive").optional(),
})

// Schema for creating a new tax
export const TaxCreateSchema = TaxBaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner: true,
})

// Schema for updating a tax
export const TaxUpdateSchema = TaxBaseSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner: true,
})

// Schema for API responses (includes related objects)
export const TaxSchema = TaxBaseSchema.extend({
  id: z.number().int().positive(),
  owner: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Schema for route
export const TaxesSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(10),
  search: z.string().optional(),
  ordering: z.string().optional(),
})
