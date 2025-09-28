import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  ExpensesCreateExpenseData,
  ExpensesCreateExpenseResponse,
  ExpensesDeleteExpenseData,
  ExpensesDeleteExpenseResponse,
  ExpensesReadExpenseCategoriesResponse,
  ExpensesReadExpenseData,
  ExpensesReadExpenseResponse,
  ExpensesReadExpensesData,
  ExpensesReadExpensesResponse,
  ExpensesUpdateExpenseData,
  ExpensesUpdateExpenseResponse,
} from "../types"

export class ExpensesService {
  /**
   * Read Expenses
   * Retrieve expenses.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns ExpensesPublic Successful Response
   * @throws ApiError
   */
  public static readExpenses(
    data: ExpensesReadExpensesData = {},
  ): CancelablePromise<ExpensesReadExpensesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/expenses/",
      query: {
        page: data.page,
        size: data.size,
        search: data.search,
        ordering: data.ordering,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Expense
   * Create new item.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns ExpensePublic Successful Response
   * @throws ApiError
   */
  public static createExpense(
    data: ExpensesCreateExpenseData,
  ): CancelablePromise<ExpensesCreateExpenseResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/expenses/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Expense
   * Get item by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns ExpensePublic Successful Response
   * @throws ApiError
   */
  public static readExpense(
    data: ExpensesReadExpenseData,
  ): CancelablePromise<ExpensesReadExpenseResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/expenses/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Expense
   * Update an item.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns ExpensePublic Successful Response
   * @throws ApiError
   */
  public static updateExpense(
    data: ExpensesUpdateExpenseData,
  ): CancelablePromise<ExpensesUpdateExpenseResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/expenses/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete Expense
   * Delete an item.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteExpense(
    data: ExpensesDeleteExpenseData,
  ): CancelablePromise<ExpensesDeleteExpenseResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/expenses/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Expense Categories
   * Retrieve expense categories
   * @returns ExpenseCategoriesPublic Successful Response
   * @throws ApiError
   */
  public static readExpenseCategories(): CancelablePromise<ExpensesReadExpenseCategoriesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/expenses/categories/",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
