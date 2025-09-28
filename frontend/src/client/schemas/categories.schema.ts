import { z } from "zod"
import { TaxSchema } from "./taxes.schema"

// Schéma pour la catégorie parente (lecture seule)
export const ParentCategorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string(),
})

// Schéma principal
export const CategoryBaseSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  parent: z.string().nullable().optional(), // ID du parent
  owner: z.number(), // lecture seule, mais reçu dans la réponse
  parent_category: ParentCategorySchema.nullable().optional(), // lecture seule
  default_taxes: z.array(TaxSchema).optional(),
})

// Schema for creating a new category (omits auto-generated fields)
export const CategoryCreateSchema = CategoryBaseSchema.omit({
  id: true,
  slug: true,
  owner: true,
  parent_category: true,
}).extend({
  default_taxes: z.array(z.string()).optional(),
})

// Schema for updating a category
export const CategoryUpdateSchema = CategoryBaseSchema.partial()
  .omit({
    id: true,
    slug: true,
    owner: true,
    parent_category: true,
  })
  .extend({
    default_taxes: z.array(z.string()).optional(),
  })

// Schema for API responses (includes related objects)
export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  parent: z.string().nullable(), // ID du parent
  owner: z.number(), // lecture seule, mais reçu dans la réponse
  parent_category: ParentCategorySchema.nullable(), // lecture seule
  default_taxes: z.array(z.number()).optional(),
  default_taxes_details: z.array(TaxSchema).optional(),
})

// Schema for route
export const CategoriesSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(10),
  search: z.string().optional(),
  ordering: z.string().optional(),
})
