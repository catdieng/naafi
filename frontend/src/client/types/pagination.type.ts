export type PaginatedResponse<T> = {
	results: T[];
	count: number;
	next: string | number | null;
	previous: string | number | null;
};

export type PaginatedRequestParams = {
	page?: number;
	size?: number;
	ordering?: string;
	search?: string;
};
