import type { z } from "zod"

import type {
  CategoryCreateSchema,
  CategorySchema,
  CategoryUpdateSchema,
} from "../schemas"
import type { Message } from "./commons.type"

export type CategoryPublic = z.infer<typeof CategorySchema>
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>

export type CategoriesPublic = {
  results: Array<CategoryPublic>
  count: number
  next: string | number | null
  previous: string | number | null
}

export type CategoriesReadCategoriesData = {
  page?: number
  size?: number
  search?: string
  ordering?: string
}

export type CategoriesReadCategoriesResponse = CategoriesPublic

export type CategoriesCreateCategoryData = {
  requestBody: CategoryCreate
}

export type CategoriesCreateCategoryResponse = CategoryPublic

export type CategoriesReadCategoryData = {
  id: number
}

export type CategoriesReadCategoryResponse = CategoryPublic

export type CategoriesUpdateCategoryData = {
  id: number
  requestBody: CategoryUpdate
}

export type CategoriesUpdateCategoryResponse = CategoryPublic

export type CategoriesDeleteCategoryData = {
  id: number
}

export type CategoriesDeleteCategoryResponse = Message
