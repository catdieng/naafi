import { z } from "zod";
import { CustomerSchema } from "./customers.schema";
import { datetimeLocalSchema } from "./date.schema";
import { OptionSchema } from "./form.schema";
import { VehicleSchema } from "./vehicules.schema";

// Principal Schema
export const AppointmentBaseSchema = z.object({
	id: z.number().int().positive().optional(),
	customer_id: z.number().nullable().optional(),
	customer: CustomerSchema.nullable().optional(),
	vehicle_id: z.number().nullable().optional(),
	vehicle: VehicleSchema.nullable().optional(),
	start: datetimeLocalSchema(),
	end: datetimeLocalSchema(),
	status: z.string().optional(),
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
	customer: true,
	services: true,
	vehicle: true,
}).extend({
	services_ids: z.array(z.string()).optional(),
});

// Updation Schema
export const AppointmentUpdateSchema = AppointmentBaseSchema.partial()
	.omit({
		id: true,
		customer: true,
		services: true,
		owner: true,
		vehicle: true,
	})
	.extend({
		services_ids: z.array(z.string()).optional(),
	});

// Form Schema
export const AppointmentFormSchema = z.object({
	start: z.string(),
	end: z.string(),
	customer_id: z.number().nullable(),
	vehicle: OptionSchema.nullable(),
	services_ids: z.array(z.string()).optional(),
	description: z.string().optional(),
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
