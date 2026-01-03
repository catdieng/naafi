import type { z } from "zod";
import type {
	VehicleCreateSchema,
	VehicleFormSchema,
	VehicleSchema,
	VehicleUpdateSchema,
} from "../schemas";
import type {
	PaginatedRequestParams,
	PaginatedResponse,
} from "./pagination.type";

// Public / create / update
export type VehiclePublic = z.infer<typeof VehicleSchema>;
export type VehicleCreate = z.infer<typeof VehicleCreateSchema>;
export type VehicleForm = z.infer<typeof VehicleFormSchema>;
export type VehicleUpdate = z.infer<typeof VehicleUpdateSchema>;

// API types
export type VehiclesReadData = PaginatedRequestParams & {
	customer_pk: number;
};

export type VehiclesReadResponse = PaginatedResponse<VehiclePublic>;

export type VehiclesCreateData = {
	customer_pk: number;
	requestBody: VehicleCreate;
};

export type VehiclesCreateResponse = VehiclePublic;

export type VehiclesReadItemData = {
	customer_pk: number;
	id: number;
};
export type VehiclesReadItemResponse = VehiclePublic;

export type VehiclesUpdateData = {
	customer_pk: number;
	id: number;
	requestBody: VehicleUpdate;
};
export type VehiclesUpdateResponse = VehiclePublic;

export type VehiclesDeleteData = {
	customer_pk: number;
	id: number;
};
export type VehiclesDeleteResponse = { message: string };
