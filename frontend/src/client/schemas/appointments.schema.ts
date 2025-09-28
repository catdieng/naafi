import { z } from "zod";
import { CustomerSchema } from "./customers.schema";
import { datetimeLocalSchema } from "./date.schema";

// Principal Schema
export const AppointmentBaseSchema = z.object({
	id: z.number().int().positive().optional(),
	customer_id: z.string().nullable().optional(),
	customer: CustomerSchema.nullable().optional(),
	start: datetimeLocalSchema(),
	end: datetimeLocalSchema(),
	description: z.string().max(250).optional(),
	services: z
		.array(
			z.object({
				id: z.number().int().positive(),
				name: z.string().min(2).max(100),
			}),
		)
		.optional(),
	owner: z.number().int().positive().optional(),
	created_at: z.string().datetime({ offset: true }).optional(),
	updated_at: z.string().datetime({ offset: true }).optional(),
});

// Creation  Schema
export const AppointmentCreateSchema = AppointmentBaseSchema.omit({
	id: true,
	owner: true,
	created_at: true,
	updated_at: true,
}).extend({
	services: z.array(z.string()).optional(),
	start: datetimeLocalSchema(),
	end: datetimeLocalSchema(),
});

// Updation Schema
export const AppointmentUpdateSchema = AppointmentBaseSchema.partial()
	.omit({
		id: true,
		owner: true,
		created_at: true,
		updated_at: true,
	})
	.extend({
		services: z.array(z.string()).optional(),
		start: datetimeLocalSchema(),
		end: datetimeLocalSchema(),
	});

// Schema for API responses (includes related objects)
export const AppointmentSchema = AppointmentBaseSchema.extend({
	id: z.number().int().positive(),
	services_ids: z.array(z.string()).optional(),
	owner: z.object({
		id: z.number().int().positive(),
		username: z.string(),
		email: z.string().email().optional(),
	}),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

export const AppointmentSearchSchema = z.object({
	start: z.string().optional(),
	end: z.string().optional(),
	customer_id: z.string().optional(),
});
