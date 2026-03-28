import { z } from "zod";
import { CustomerSimpleSchema } from "./customers.schema";
import { nullableDateSchema } from "./date.schema";
import { InvoiceItemSchema } from "./invoice-items.schema";

// Principal Schema
export const InvoiceBaseSchema = z.object({
	id: z.number().int().positive().optional(),
	invoice_number: z.string().optional(),
	issue_date: nullableDateSchema("Invalid issue date"),
	due_date: nullableDateSchema("Invalid due date"),
	customer_id: z.string().nullable().optional(),
	owner_id: z.number().int().positive().optional(),
	subtotal: z.number(),
	total_tax: z.number(),
	total: z.number(),
	items: z.array(InvoiceItemSchema),
	created_at: z.string().datetime({ offset: true }).optional(),
	updated_at: z.string().datetime({ offset: true }).optional(),
});

// Creation Schema
export const InvoiceCreateSchema = InvoiceBaseSchema.omit({
	id: true,
	owner_id: true,
	created_at: true,
	updated_at: true,
	subtotal: true,
	total: true,
	total_tax: true,
}).extend({
	items: z.array(InvoiceItemSchema).min(1),
});

// Updation Schema
export const InvoiceUpdateSchema = InvoiceBaseSchema.omit({
	id: true,
	owner_id: true,
	created_at: true,
	updated_at: true,
	subtotal: true,
	total: true,
	total_tax: true,
}).extend({
	items: z.array(InvoiceItemSchema).min(1),
});

// Schema for API responses (includes related objects)
export const InvoiceSchema = InvoiceBaseSchema.extend({
	id: z.number().int().positive(),
	owner: z.object({
		id: z.number().int().positive(),
		username: z.string(),
		email: z.string().email().optional(),
	}),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
}).extend({
	customer: CustomerSimpleSchema,
});

export const InvoiceSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});
