import type { z } from "zod";

import type {
	CustomerCreateSchema,
	CustomerSchema,
	CustomerSimpleSchema,
	CustomerUpdateSchema,
} from "../schemas";
import type { Message } from "./commons.type";

export type CustomerPublic = z.infer<typeof CustomerSchema>;
export type CustomerCreate = z.infer<typeof CustomerCreateSchema>;
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>;
export type CustomerSimplePublic = z.infer<typeof CustomerSimpleSchema>;

export type CustomersPublic = {
	results: Array<CustomerPublic>;
	count: number;
	next: string | number | null;
	previous: string | number | null;
};

export type CustomersReadCustomersData = {
	page?: number;
	size?: number;
	search?: string;
	ordering?: string;
};

export type CustomersReadCustomersResponse = CustomersPublic;

export type CustomersCreateCustomerData = {
	requestBody: CustomerCreate;
};

export type CustomersCreateCustomerResponse = CustomerPublic;

export type CustomersReadCustomerData = {
	id: string;
};

export type CustomersReadCustomerResponse = CustomerPublic;

export type CustomersUpdateCustomerData = {
	id: number;
	requestBody: CustomerUpdate;
};

export type CustomersUpdateCustomerResponse = CustomerPublic;

export type CustomersDeleteCustomerData = {
	id: number;
};

export type CustomersDeleteCustomerResponse = Message;

type CustomerSearch = {
	search: string;
};

export type CustomersSearchCustomerData = CustomerSearch;

export type CustomersSearchCustomerResponse = {
	results: Array<CustomerPublic>;
};
