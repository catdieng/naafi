import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
  ItemsCreateItemData,
  ItemsCreateItemResponse,
  ItemsDeleteItemData,
  ItemsDeleteItemResponse,
  ItemsReadItemData,
  ItemsReadItemResponse,
  ItemsReadItemsData,
  ItemsReadItemsResponse,
  ItemsSearchItemResponse,
  ItemsUpdateItemData,
  ItemsUpdateItemResponse,
} from "../types"

export class ItemsService {
  /**
   * Read Items
   * Retrieve items.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItems(
    data: ItemsReadItemsData = {},
  ): CancelablePromise<ItemsReadItemsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/",
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
   * Create Item
   * Create new item.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createItem(
    data: ItemsCreateItemData,
  ): CancelablePromise<ItemsCreateItemResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/items/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Item
   * Get item by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readItem(
    data: ItemsReadItemData,
  ): CancelablePromise<ItemsReadItemResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Item
   * Update an item.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateItem(
    data: ItemsUpdateItemData,
  ): CancelablePromise<ItemsUpdateItemResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/items/{id}/",
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
   * Delete Item
   * Delete an item.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteItem(
    data: ItemsDeleteItemData,
  ): CancelablePromise<ItemsDeleteItemResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/items/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Item Categories
   * Retrieve item categories.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns CategoriesPublic Successful Response
   * @throws ApiError
   */
  public static readItemCategories(): CancelablePromise<ItemsReadItemsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/categories/",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Items
   * Retrieve all items
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItemsAll(): CancelablePromise<ItemsReadItemsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/all/",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Search Item
   * Search an item.
   * @param data The data for the request.
   * @param data.search
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static searchItem(
    data: { search?: string } = {},
  ): CancelablePromise<ItemsSearchItemResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/search/",
      query: {
        search: data.search,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
