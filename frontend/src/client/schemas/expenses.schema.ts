import { z } from "zod"
import { dateSchema, nullableDateSchema } from "./date.schema"

export const currencyChoices = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "XOF",
] as const

export const ExpenseCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const ExpenseBaseSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Name is required").max(255),
  amount: z.coerce.number(),
  description: z.string().nullable().optional(),
  currency: z.enum(currencyChoices).optional(),
  date: dateSchema(),
  due_date: nullableDateSchema("Invalid due date value"),
  supplier: z.string().max(255).nullable().optional(),
  reference: z.string().max(100).nullable().optional(),
  paid: z.boolean().optional(),
  payment_date: nullableDateSchema("Invalid payment date"),
  payment_method: z.string().max(50).nullable().optional(),
  category_id: z.string().nullable().optional(),
  owner: z.number().int().positive().optional(),
  created_at: z.string().datetime({ offset: true }).optional(),
  updated_at: z.string().datetime({ offset: true }).optional(),
})

// Schema for creating a new expense (omits auto-generated fields)
export const ExpenseCreateSchema = ExpenseBaseSchema.omit({
  id: true,
  owner: true,
  created_at: true,
  updated_at: true,
}).refine(({ paid, payment_date }) => !paid || !!payment_date, {
  path: ["payment_date"],
  message: "Payment date is required when paid is true",
})

// Schema for updating an expense
export const ExpenseUpdateSchema = ExpenseBaseSchema.partial()
  .omit({
    owner: true,
    created_at: true,
    updated_at: true,
  })
  .refine(({ paid, payment_date }) => !paid || !!payment_date, {
    path: ["payment_date"],
    message: "Payment date is required when paid is true",
  })

// Schema for API responses (includes related objects)
export const ExpenseSchema = ExpenseBaseSchema.extend({
  id: z.number().int().positive(),
  category: ExpenseCategorySchema.nullable().optional(),
  owner: z.object({
    id: z.number().int().positive(),
    username: z.string(),
    email: z.string().email().optional(),
  }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const ExpenseSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(10),
  search: z.string().optional(),
  ordering: z.string().optional(),
})
