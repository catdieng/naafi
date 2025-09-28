import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  InvoicesCreateInvoiceData,
  InvoicesCreateInvoiceResponse,
  InvoicesDeleteInvoiceData,
  InvoicesDeleteInvoiceResponse,
  InvoicesReadInvoiceData,
  InvoicesReadInvoiceResponse,
  InvoicesReadInvoicesData,
  InvoicesReadInvoicesResponse,
  InvoicesUpdateInvoiceData,
  InvoicesUpdateInvoiceResponse,
} from "../types"

export class InvoicesService {
  /**
   * Read Invoices
   * Retrieve invoices.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns InvoicesPublic Successful Response
   * @throws ApiError
   */
  public static readInvoices(
    data: InvoicesReadInvoicesData = {},
  ): CancelablePromise<InvoicesReadInvoicesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/invoices/",
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
   * Create Invoice
   * Create new invoice.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns InvoicePublic Successful Response
   * @throws ApiError
   */
  public static createInvoice(
    data: InvoicesCreateInvoiceData,
  ): CancelablePromise<InvoicesCreateInvoiceResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/invoices/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Invoice
   * Get invoice by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns InvoicePublic Successful Response
   * @throws ApiError
   */
  public static readInvoice(
    data: InvoicesReadInvoiceData,
  ): CancelablePromise<InvoicesReadInvoiceResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/invoices/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Invoice
   * Update an invoice.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns InvoicePublic Successful Response
   * @throws ApiError
   */
  public static updateInvoice(
    data: InvoicesUpdateInvoiceData,
  ): CancelablePromise<InvoicesUpdateInvoiceResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/invoices/{id}/",
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
   * Delete Invoice
   * Delete an invoice.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteInvoice(
    data: InvoicesDeleteInvoiceData,
  ): CancelablePromise<InvoicesDeleteInvoiceResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/invoices/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
