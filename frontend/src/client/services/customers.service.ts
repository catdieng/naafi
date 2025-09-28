import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  CustomersCreateCustomerData,
  CustomersCreateCustomerResponse,
  CustomersDeleteCustomerData,
  CustomersDeleteCustomerResponse,
  CustomersReadCustomerData,
  CustomersReadCustomerResponse,
  CustomersReadCustomersData,
  CustomersReadCustomersResponse,
  CustomersSearchCustomerData,
  CustomersSearchCustomerResponse,
  CustomersUpdateCustomerData,
  CustomersUpdateCustomerResponse,
} from "../types"

export class CustomersService {
  /**
   * Read Customers
   * Retrieve customers.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns CustomersPublic Successful Response
   * @throws ApiError
   */
  public static readCustomers(
    data: CustomersReadCustomersData = {},
  ): CancelablePromise<CustomersReadCustomersResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/customers/",
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
   * Create Customer
   * Create new customer.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns CustomerPublic Successful Response
   * @throws ApiError
   */
  public static createCustomer(
    data: CustomersCreateCustomerData,
  ): CancelablePromise<CustomersCreateCustomerResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/customers/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Customer
   * Get customer by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns CustomerPublic Successful Response
   * @throws ApiError
   */
  public static readCustomer(
    data: CustomersReadCustomerData,
  ): CancelablePromise<CustomersReadCustomerResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/customers/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Customer
   * Update an customer.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns CustomerPublic Successful Response
   * @throws ApiError
   */
  public static updateCustomer(
    data: CustomersUpdateCustomerData,
  ): CancelablePromise<CustomersUpdateCustomerResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/customers/{id}/",
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
   * Delete Customer
   * Delete an customer.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteCustomer(
    data: CustomersDeleteCustomerData,
  ): CancelablePromise<CustomersDeleteCustomerResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/customers/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Search customer
   * Search a customer
   * @param data The data for the request.
   * @param data.requestBody
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static searchCustomer(
    data: CustomersSearchCustomerData,
  ): CancelablePromise<CustomersSearchCustomerResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/customers/search/",
      query: { 
        search: data.search 
      },
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
