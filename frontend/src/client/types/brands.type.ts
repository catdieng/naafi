import type { z } from "zod";
import type {
	BrandCreateSchema,
	BrandSchema,
	BrandUpdateSchema,
	VehicleModelCreateSchema,
	VehicleModelFormSchema,
	VehicleModelSchema,
	VehicleModelUpdateSchema,
} from "../schemas/brands.schema";
import type { PaginatedResponse } from "./pagination.type";

export type BrandPublic = z.infer<typeof BrandSchema>;
export type BrandCreate = z.infer<typeof BrandCreateSchema>;
export type BrandUpdate = z.infer<typeof BrandUpdateSchema>;

export type BrandsPublic = {
	results: Array<BrandPublic>;
	count: number;
	next: string | number | null;
	previous: string | number | null;
};

export type BrandsReadBrandsData = {
	page?: number;
	size?: number;
	search?: string;
	ordering?: string;
};

export type BrandsReadBrandsResponse = BrandsPublic;

export type BrandsCreateBrandData = {
	requestBody: BrandCreate;
};

export type BrandsCreateBrandResponse = BrandPublic;

export type BrandsReadBrandData = {
	id: string;
};

export type BrandsReadBrandResponse = BrandPublic;

export type BrandsUpdateBrandData = {
	id: number;
	requestBody: BrandUpdate;
};

export type BrandsUpdateBrandResponse = BrandPublic;

export type BrandsDeleteBrandData = {
	id: number;
};

export type BrandsDeleteBrandResponse = { message: string };

type BrandSearch = {
	search: string;
};

export type BrandsSearchBrandData = BrandSearch;

export type BrandsSearchBrandResponse = {
	results: Array<BrandPublic>;
};

export type VehicleModelPublic = z.infer<typeof VehicleModelSchema>;
export type VehicleModelCreate = z.infer<typeof VehicleModelCreateSchema>;
export type VehicleModelUpdate = z.infer<typeof VehicleModelUpdateSchema>;

export type BrandsReadModelsData = {
	brand_pk: number;
	ordering?: string;
	search?: string;
	page?: number;
	size?: number;
};

export type BrandsReadModelsResponse = PaginatedResponse<VehicleModelPublic>;

export type BrandsCreateModelData = {
	brand_pk: number;
	requestBody: VehicleModelCreate;
};

export type BrandsCreateModelResponse = VehicleModelPublic;

export type BrandsReadModelData = {
	brand_pk: number;
	id: string;
};

export type BrandsReadModelResponse = VehicleModelPublic;

export type BrandsUpdateModelData = {
	brand_pk: number;
	id: number;
	requestBody: VehicleModelUpdate;
};

export type BrandsUpdateModelResponse = VehicleModelPublic;

export type BrandsDeleteModelData = {
	brand_pk: number;
	id: number;
};

export type BrandsDeleteModelResponse = { message: string };

export type VehicleModelFormValues = z.infer<typeof VehicleModelFormSchema>;
