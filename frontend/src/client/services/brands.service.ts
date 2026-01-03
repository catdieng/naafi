import { request as __request } from "@/client/core/request";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";

import type {
	BrandsCreateBrandData,
	BrandsCreateBrandResponse,
	BrandsCreateModelData,
	BrandsCreateModelResponse,
	BrandsDeleteBrandData,
	BrandsDeleteBrandResponse,
	BrandsDeleteModelData,
	BrandsReadBrandData,
	BrandsReadBrandResponse,
	BrandsReadBrandsData,
	BrandsReadBrandsResponse,
	BrandsReadModelData,
	BrandsReadModelResponse,
	BrandsReadModelsData,
	BrandsReadModelsResponse,
	BrandsSearchBrandData,
	BrandsSearchBrandResponse,
	BrandsUpdateBrandData,
	BrandsUpdateBrandResponse,
	BrandsUpdateModelData,
	BrandsUpdateModelResponse,
} from "../types";

export const BrandsService = {
	/**
	 * Read Brands
	 * Retrieve brands.
	 * @param data The data for the request.
	 * @param data.skip
	 * @param data.limit
	 * @returns BrandsPublic Successful Response
	 * @throws ApiError
	 */
	readBrands(
		data: BrandsReadBrandsData = {},
	): CancelablePromise<BrandsReadBrandsResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/",
			query: {
				ordering: data.ordering,
				page: data.page,
				size: data.size,
				search: data.search,
			},
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Create Brand
	 * Create new tax.
	 * @param data The data for the request.
	 * @param data.requestBody
	 * @returns BrandPublic Successful Response
	 * @throws ApiError
	 */
	createBrand(
		data: BrandsCreateBrandData,
	): CancelablePromise<BrandsCreateBrandResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/brands/",
			body: data.requestBody,
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Read Brand
	 * Get tax by ID.
	 * @param data The data for the request.
	 * @param data.id
	 * @returns BrandPublic Successful Response
	 * @throws ApiError
	 */
	readBrand(
		data: BrandsReadBrandData,
	): CancelablePromise<BrandsReadBrandResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/{id}/",
			path: {
				id: data.id,
			},
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Update Brand
	 * Update an tax.
	 * @param data The data for the request.
	 * @param data.id
	 * @param data.requestBody
	 * @returns BrandPublic Successful Response
	 * @throws ApiError
	 */
	updateBrand(
		data: BrandsUpdateBrandData,
	): CancelablePromise<BrandsUpdateBrandResponse> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/api/v1/brands/{id}/",
			path: {
				id: data.id,
			},
			body: data.requestBody,
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Delete Brand
	 * Delete an tax.
	 * @param data The data for the request.
	 * @param data.id
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	deleteBrand(
		data: BrandsDeleteBrandData,
	): CancelablePromise<BrandsDeleteBrandResponse> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/api/v1/brands/{id}/",
			path: {
				id: data.id,
			},
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Read All brands
	 * Retrieve all brands.
	 * @param data The data for the request.
	 * @param data.skip
	 * @param data.limit
	 * @returns CategoriesPublic Successful Response
	 * @throws ApiError
	 */
	readAllBrands(): CancelablePromise<BrandsReadBrandsResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/all/",
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * List Models for a Brand
	 * Retrieve all models associated with a specific brand.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.skip
	 * @param data.limit
	 * @returns ModelsPublic Successful Response
	 * @throws ApiError
	 */
	readModels(
		data: BrandsReadModelsData,
	): CancelablePromise<BrandsReadModelsResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/{brand_pk}/models/",
			path: { brand_pk: data.brand_pk },
			query: {
				ordering: data.ordering,
				page: data.page,
				size: data.size,
				search: data.search,
			},
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Create Model for a Brand
	 * Add a new model under a specific brand.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.requestBody
	 * @returns ModelPublic Successful Response
	 * @throws ApiError
	 */
	createModel(
		data: BrandsCreateModelData,
	): CancelablePromise<BrandsCreateModelResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/brands/{brand_pk}/models/",
			path: { brand_pk: data.brand_pk },
			body: data.requestBody,
			mediaType: "application/json",
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Read a Brand Model
	 * Retrieve details of a specific model under a brand.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.id
	 * @returns ModelPublic Successful Response
	 * @throws ApiError
	 */
	readModel(
		data: BrandsReadModelData,
	): CancelablePromise<BrandsReadModelResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/{brand_pk}/models/{id}/",
			path: { brand_pk: data.brand_pk, id: data.id },
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Update Brand Model
	 * Replace model data entirely.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.id
	 * @param data.requestBody
	 * @returns ModelPublic Successful Response
	 * @throws ApiError
	 */
	updateModel(
		data: BrandsUpdateModelData,
	): CancelablePromise<BrandsUpdateModelResponse> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/api/v1/brands/{brand_pk}/models/{id}/",
			path: { brand_pk: data.brand_pk, id: data.id },
			body: data.requestBody,
			mediaType: "application/json",
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Partial Update Brand Model
	 * Update only specific fields of a model.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.id
	 * @param data.requestBody
	 * @returns ModelPublic Successful Response
	 * @throws ApiError
	 */
	partialUpdateModel(
		data: BrandsUpdateModelData,
	): CancelablePromise<BrandsUpdateModelResponse> {
		return __request(OpenAPI, {
			method: "PATCH",
			url: "/api/v1/brands/{brand_pk}/models/{id}/",
			path: { brand_pk: data.brand_pk, id: data.id },
			body: data.requestBody,
			mediaType: "application/json",
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Delete Brand Model
	 * Remove a model under a brand.
	 * @param data The data for the request.
	 * @param data.brand_pk
	 * @param data.id
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	deleteModel(
		data: BrandsDeleteModelData,
	): CancelablePromise<BrandsUpdateModelResponse> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/api/v1/brands/{brand_pk}/models/{id}/",
			path: { brand_pk: data.brand_pk, id: data.id },
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Search Brand
	 * Search an brand
	 * @param data The data for the request
	 * @param data.search
	 * @returns BrandsPublic Successful Response
	 * @throws ApiError
	 */
	searchBrand(
		data: BrandsSearchBrandData,
	): CancelablePromise<BrandsSearchBrandResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/brands/search/",
			query: {
				search: data.search,
			},
			errors: {
				422: "Validation Error",
			},
		});
	},
};
