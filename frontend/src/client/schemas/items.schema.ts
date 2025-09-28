import { z } from "zod";
import { CategorySchema } from "./categories.schema";
import { TaxSchema } from "./taxes.schema";

export const ItemCategorySchema = CategorySchema;

// Schema principal
export const ItemBaseSchema = z.object({
	id: z.number().int().positive().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	price: z.number(),
	duration: z.string().optional(),
	owner: z.number().int().positive().optional(),
	category_id: z.string().nullable().optional(),
	custom_taxes: z.array(TaxSchema).optional(),
	applicable_taxes: z.array(TaxSchema).optional(),
	created_at: z.string().datetime({ offset: true }).optional(),
	updated_at: z.string().datetime({ offset: true }).optional(),
});

// schema for creating item
export const ItemCreateSchema = ItemBaseSchema.omit({
	id: true,
	owner: true,
	created_at: true,
	updated_at: true,
}).extend({
	custom_taxes: z.array(z.string()).optional(),
});

// schema for updating item
export const ItemUpdateSchema = ItemBaseSchema.partial()
	.omit({
		id: true,
		owner: true,
		created_at: true,
		updated_at: true,
	})
	.extend({
		custom_taxes: z.array(z.string()).optional(),
	});

// Schema for API responses (includes related object)
export const ItemSchema = ItemBaseSchema.extend({
	id: z.number().int().positive(),
	custom_taxes: z.array(z.number()).optional(),
	applicable_taxes: z.array(TaxSchema).optional(),
	custom_taxes_details: z.array(TaxSchema).optional(),
	category: ItemCategorySchema.nullable().optional(),
	category_id: z.string().nullable().optional(),
	owner: z.number().int().positive(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

// Schema for route
export const ItemsSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
	ordering: z.string().optional(),
});
