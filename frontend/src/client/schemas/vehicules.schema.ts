import { z } from "zod";
import { OptionSchema } from "./form.schema";

export const VehicleBaseSchema = z.object({
	id: z.number().int().optional(),
	customer: z.number().int().positive(),
	brand: z.number().int().optional(),
	brand_name: z.string().optional(),
	model: z.number().int().positive(),
	model_name: z.string().optional(),
	license_plate: z.string().max(20),
	year: z.number().int().optional(),
	vin: z.string().max(50).optional(),
	owner: z.number().int().optional(),
	created_at: z.string().datetime().optional(),
	updated_at: z.string().datetime().optional(),
});

// Vehicle form schema
export const VehicleFormSchema = z.object({
	customer: z.number().int().positive(),
	brand: OptionSchema, // store full object for React Select
	model: OptionSchema,
	license_plate: z.string().max(20),
	year: z.number().optional(),
	vin: z.string().max(50).optional(),
	owner: z.number().int().optional(),
});

export const VehicleCreateSchema = VehicleBaseSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

export const VehicleUpdateSchema = VehicleBaseSchema.partial().omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

export const VehicleSchema = z.object({
	id: z.number().int(),
	customer: z.number().int().positive(),
	brand: z.number().int(),
	brand_name: z.string(),
	model: z.number(),
	model_name: z.string(),
	license_plate: z.string().max(20),
	year: z.number().int().optional(),
	vin: z.string().max(50).optional(),
	owner: z.number().int().optional(),
	created_at: z.string().datetime().optional(),
	updated_at: z.string().datetime().optional(),
});
