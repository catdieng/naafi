import { z } from "zod";

export const BrandBaseSchema = z.object({
	id: z.number().int().positive().optional(), // usually read-only
	name: z.string().min(1, "Brand name is required").max(100),
	created_at: z.string().datetime().optional(), // read-only
	updated_at: z.string().datetime().optional(), // read-only
	owner: z.number().int().positive().optional(), // usually backend-controlled
});

// Schema for creating a new brand (omits auto-generated fields)
export const BrandCreateSchema = BrandBaseSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

// Schema for updating a brand
export const BrandUpdateSchema = BrandBaseSchema.partial().omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

// Schema for API responses (includes related objects)
export const BrandSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

// Schema for route
export const BrandsSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});

// Schema for brand model
export const VehicleModelBaseSchema = z.object({
	id: z.number().int().positive().optional(), // usually read-only
	name: z.string().min(1, "Model name is required").max(100),
	brand: z.number().int().positive(),
	created_at: z.string().datetime().optional(), // read-only
	updated_at: z.string().datetime().optional(), // read-only
});

// Schema for creating a new vehicle model (omits auto-generated fields)
export const VehicleModelCreateSchema = VehicleModelBaseSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
});

// Schema for updating a vehicle model
export const VehicleModelUpdateSchema = VehicleModelBaseSchema.partial().omit({
	id: true,
	created_at: true,
	updated_at: true,
});

// Schema for vehicle model API responses
export const VehicleModelSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	brand_id: z.number().int().positive(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

// Schema for route
export const VehicleModelsSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});

export const VehicleModelsByBrandSchema = z.object({
	brand_pk: z.number().int().positive(),
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});

export const VehicleModelByBrandSchema = z.object({
	brand_pk: z.number().int().positive(),
	id: z.number().int().positive(),
});

export const VehicleModelCreateByBrandSchema = z.object({
	brand_pk: z.number().int().positive(),
	requestBody: VehicleModelCreateSchema,
});

// Form Schema
export const VehicleModelFormSchema = z.object({
	name: z.string().min(1, "Model name is required").max(100),
});

export const VehicleModelUpdateByBrandSchema = z.object({
	brand_pk: z.number().int().positive(),
	id: z.number().int().positive(),
	requestBody: VehicleModelUpdateSchema,
});

export const VehicleModelDeleteByBrandSchema = z.object({
	brand_pk: z.number().int().positive(),
	id: z.number().int().positive(),
});
