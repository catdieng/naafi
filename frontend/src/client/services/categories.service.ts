import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  CategoriesCreateCategoryData,
  CategoriesCreateCategoryResponse,
  CategoriesDeleteCategoryData,
  CategoriesDeleteCategoryResponse,
  CategoriesReadCategoriesData,
  CategoriesReadCategoriesResponse,
  CategoriesReadCategoryData,
  CategoriesReadCategoryResponse,
  CategoriesUpdateCategoryData,
  CategoriesUpdateCategoryResponse,
} from "../types"

export class CategoriesService {
  /**
   * Read Categories
   * Retrieve categories.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns CategoriesPublic Successful Response
   * @throws ApiError
   */
  public static readCategories(
    data: CategoriesReadCategoriesData = {},
  ): CancelablePromise<CategoriesReadCategoriesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/",
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
   * Create Category
   * Create new item.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns CategoryPublic Successful Response
   * @throws ApiError
   */
  public static createCategory(
    data: CategoriesCreateCategoryData,
  ): CancelablePromise<CategoriesCreateCategoryResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/categories/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Category
   * Get item by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns CategoryPublic Successful Response
   * @throws ApiError
   */
  public static readCategory(
    data: CategoriesReadCategoryData,
  ): CancelablePromise<CategoriesReadCategoryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Category
   * Update an item.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns CategoryPublic Successful Response
   * @throws ApiError
   */
  public static updateCategory(
    data: CategoriesUpdateCategoryData,
  ): CancelablePromise<CategoriesUpdateCategoryResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/categories/{id}/",
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
   * Delete Category
   * Delete an item.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteCategory(
    data: CategoriesDeleteCategoryData,
  ): CancelablePromise<CategoriesDeleteCategoryResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/categories/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read All Categories
   * Retrieve all categories.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns CategoriesPublic Successful Response
   * @throws ApiError
   */
  public static readAllCategories(): CancelablePromise<CategoriesReadCategoriesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/all/",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
