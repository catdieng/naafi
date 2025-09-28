import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  TaxesCreateTaxData,
  TaxesCreateTaxResponse,
  TaxesDeleteTaxData,
  TaxesDeleteTaxResponse,
  TaxesReadTaxData,
  TaxesReadTaxesData,
  TaxesReadTaxesResponse,
  TaxesReadTaxResponse,
  TaxesUpdateTaxData,
  TaxesUpdateTaxResponse,
} from "../types"

export class TaxesService {
  /**
   * Read Taxes
   * Retrieve taxes.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns TaxesPublic Successful Response
   * @throws ApiError
   */
  public static readTaxes(
    data: TaxesReadTaxesData = {},
  ): CancelablePromise<TaxesReadTaxesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/taxes/",
      query: {
        ordering: data.ordering,
        page: data.page,
        size: data.size,
        search: data.search,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Tax
   * Create new tax.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns TaxPublic Successful Response
   * @throws ApiError
   */
  public static createTax(
    data: TaxesCreateTaxData,
  ): CancelablePromise<TaxesCreateTaxResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/taxes/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Tax
   * Get tax by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns TaxPublic Successful Response
   * @throws ApiError
   */
  public static readTax(
    data: TaxesReadTaxData,
  ): CancelablePromise<TaxesReadTaxResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/taxes/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Tax
   * Update an tax.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns TaxPublic Successful Response
   * @throws ApiError
   */
  public static updateTax(
    data: TaxesUpdateTaxData,
  ): CancelablePromise<TaxesUpdateTaxResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/taxes/{id}/",
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
   * Delete Tax
   * Delete an tax.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTax(
    data: TaxesDeleteTaxData,
  ): CancelablePromise<TaxesDeleteTaxResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/taxes/{id}/",
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
  public static readAllTaxes(): CancelablePromise<TaxesReadTaxesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/taxes/all/",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
