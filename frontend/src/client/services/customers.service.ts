import { request as __request } from "@/client/core/request";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";

import type {
	CustomersCreateCustomerData,
	CustomersCreateCustomerResponse,
	CustomersCreateVehicleData,
	CustomersCreateVehicleResponse,
	CustomersDeleteCustomerData,
	CustomersDeleteCustomerResponse,
	CustomersDeleteVehicleData,
	CustomersDeleteVehicleResponse,
	CustomersReadCustomerData,
	CustomersReadCustomerResponse,
	CustomersReadCustomersData,
	CustomersReadCustomersResponse,
	CustomersReadVehiclesData,
	CustomersReadVehiclesResponse,
	CustomersSearchCustomerData,
	CustomersSearchCustomerResponse,
	CustomersUpdateCustomerData,
	CustomersUpdateCustomerResponse,
	CustomersUpdateVehicleData,
	CustomersUpdateVehicleResponse,
} from "../types";

export const CustomersService = {
	/**
	 * Read Customers
	 * Retrieve customers.
	 * @param data The data for the request.
	 * @param data.skip
	 * @param data.limit
	 * @returns CustomersPublic Successful Response
	 * @throws ApiError
	 */
	readCustomers(
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
		});
	},

	/**
	 * Create Customer
	 * Create new customer.
	 * @param data The data for the request.
	 * @param data.requestBody
	 * @returns CustomerPublic Successful Response
	 * @throws ApiError
	 */
	createCustomer(
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
		});
	},

	/**
	 * Read Customer
	 * Get customer by ID.
	 * @param data The data for the request.
	 * @param data.id
	 * @returns CustomerPublic Successful Response
	 * @throws ApiError
	 */
	readCustomer(
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
		});
	},

	/**
	 * Update Customer
	 * Update an customer.
	 * @param data The data for the request.
	 * @param data.id
	 * @param data.requestBody
	 * @returns CustomerPublic Successful Response
	 * @throws ApiError
	 */
	updateCustomer(
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
		});
	},

	/**
	 * Delete Customer
	 * Delete an customer.
	 * @param data The data for the request.
	 * @param data.id
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	deleteCustomer(
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
		});
	},

	/**
	 * Search customer
	 * Search a customer
	 * @param data The data for the request.
	 * @param data.requestBody
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	searchCustomer(
		data: CustomersSearchCustomerData,
	): CancelablePromise<CustomersSearchCustomerResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/customers/search/",
			query: {
				search: data.search,
			},
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 *  List Vehicles for a Customer
	 *  Retrieve all customer vehicles
	 *  @param data The data for the request.
	 *  @param data.customer_pk
	 *  @param data.ordering
	 *  @param data.page
	 *  @param data.size
	 *  @param data.search
	 *  @returns VehiclesPublic Successful Response
	 *  @throws ApiError
	 */
	readVehicles(
		data: CustomersReadVehiclesData,
	): CancelablePromise<CustomersReadVehiclesResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/customers/{customer_pk}/vehicles/",
			path: { customer_pk: data.customer_pk },
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
	 * Create a Vehicle for a Customer
	 * Add a new vehicle for a customer
	 * @param data The data for the request.
	 * @param data.customer_pk The primary key of the customer.
	 * @param data.requestBody
	 * @returns VehiclePublic Successful Response
	 * @throws ApiError
	 */
	createVehicle(
		data: CustomersCreateVehicleData,
	): CancelablePromise<CustomersCreateVehicleResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/customers/{customer_pk}/vehicles/",
			path: { customer_pk: data.customer_pk },
			body: data.requestBody,
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Update Customer Vehicle
	 * Update customer vehicle
	 * @param data The data for the request.
	 * @param data.customer_pk
	 * @param data.id
	 * @param data.requestBody
	 * @returns VehiclePublic Successful Response
	 * @throws ApiError
	 */
	updateVehicle(
		data: CustomersUpdateVehicleData,
	): CancelablePromise<CustomersUpdateVehicleResponse> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/api/v1/customers/{customer_pk}/vehicles/{id}/",
			path: { customer_pk: data.customer_pk, id: data.id },
			body: data.requestBody,
			mediaType: "application/json",
			errors: { 422: "Validation Error" },
		});
	},

	/**
	 * Delete Customer Vehicle
	 * Dele a customer vehicle
	 * @param data The data for the request.
	 * @param data.customer_pk
	 * @param data.id
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	deleteVehicle(
		data: CustomersDeleteVehicleData,
	): CancelablePromise<CustomersDeleteVehicleResponse> {
		console.log("data", data);
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/api/v1/customers/{customer_pk}/vehicles/{id}/",
			path: { customer_pk: data.customer_pk, id: data.id },
			errors: { 422: "Validation Error" },
		});
	},
};
