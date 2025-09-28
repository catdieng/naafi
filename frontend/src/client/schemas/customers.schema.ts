import { z } from "zod";

export const CustomerBaseSchema = z.object({
	id: z.number().int().positive().optional(), // usually read-only
	full_name: z.string().min(1, "Full name is required").max(100),
	email: z.string().email("Invalid email address"),
	phone: z.string().max(20).nullable().optional(),
	address: z.string().nullable().optional(),
	created_at: z.string().datetime().optional(), // read-only
	updated_at: z.string().datetime().optional(), // read-only
	owner: z.number().int().positive().optional(), // usually backend-controlled
});

// Schema for simple customer info
export const CustomerSimpleSchema = CustomerBaseSchema.omit({
	email: true,
	phone: true,
	address: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

// Schema for creating a new customer (omits auto-generated fields)
export const CustomerCreateSchema = CustomerBaseSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

// Schema for updating a customer
export const CustomerUpdateSchema = CustomerBaseSchema.partial().omit({
	id: true,
	created_at: true,
	updated_at: true,
	owner: true,
});

// Schema for API responses (includes related objects)
export const CustomerSchema = z.object({
	id: z.number().int().positive(),
	full_name: z.string(),
	email: z.string().email(),
	phone: z.string().nullable(),
	address: z.string().nullable(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

// Schema for route
export const CustomersSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});
