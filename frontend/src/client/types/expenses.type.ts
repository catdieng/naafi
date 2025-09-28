import type { z } from "zod"

import type {
  ExpenseCategorySchema,
  ExpenseCreateSchema,
  ExpenseSchema,
  ExpenseUpdateSchema,
} from "../schemas"
import type { Message } from "./commons.type"

export type ExpensePublic = z.infer<typeof ExpenseSchema>
export type ExpenseCreate = z.infer<typeof ExpenseCreateSchema>
export type ExpenseUpdate = z.infer<typeof ExpenseUpdateSchema>
export type ExpenseCategoryPublic = z.infer<typeof ExpenseCategorySchema>

export type ExpensesPublic = {
  results: Array<ExpensePublic>
  count: number
  next: string | number | null
  previous: string | number | null
}

export type ExpensesReadExpensesData = {
  page?: number
  size?: number
  search?: string
  ordering?: string
}

export type ExpensesReadExpensesResponse = ExpensesPublic

export type ExpensesCreateExpenseData = {
  requestBody: ExpenseCreate
}

export type ExpensesCreateExpenseResponse = ExpensePublic

export type ExpensesReadExpenseData = {
  id: string
}

export type ExpensesReadExpenseResponse = ExpensePublic

export type ExpensesUpdateExpenseData = {
  id: number
  requestBody: ExpenseUpdate
}

export type ExpensesUpdateExpenseResponse = ExpensePublic

export type ExpensesDeleteExpenseData = {
  id: number
}

export type ExpensesDeleteExpenseResponse = Message

export type ExpensesReadExpenseCategoriesResponse = {
  results: Array<ExpenseCategoryPublic>
}
