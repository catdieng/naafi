import type { ALLOWED_SETTINGS, Domain, DomainKey } from "@/client";

export type SettingItem<
	D extends Domain,
	K extends DomainKey<D>,
> = (typeof ALLOWED_SETTINGS)[D][K];

export type SettingType<
	D extends Domain,
	K extends DomainKey<D>,
> = (typeof ALLOWED_SETTINGS)[D][K] extends { type: infer T } ? T : never;

export type SettingValue<
	D extends Domain,
	K extends DomainKey<D>,
> = SettingType<D, K> extends "str"
	? string | null
	: SettingType<D, K> extends "int"
		? number | null
		: SettingType<D, K> extends "bool"
			? boolean | null
			: SettingType<D, K> extends "json"
				? Record<string, any>
				: never;

export type DomainSettings<D extends Domain> = {
	[K in DomainKey<D>]: SettingValue<D, K>;
};

// export interface SettingPublic {
// 	id: number;
// 	domain: string; // "company" | "billing"
// 	key: string;
// 	value: string | number | boolean | Record<string, any>;
// 	file?: string; // URL of uploaded file
// 	type: SettingType;
// 	created_at: string; // ISO datetime
// 	updated_at: string; // ISO datetime
// }

export type SettingPublic<D extends Domain = Domain> = {
	id: number;
	domain: D;
	key: string; // allow any key dynamically
	value: string | number | boolean | Record<string, any>;
	file?: string;
	type: SettingType<D, DomainKey<D>>; // use general type
	created_at: string;
	updated_at: string;
};

export interface SettingUpdate {
	domain: string; // must match domain
	key: string; // must match key
	value?: string | number | boolean | Record<string, any>;
	file?: File;
}

export interface SettingsReadSettingsData {
	domain?: Domain; // optional filter by domain
}

export type SettingsReadSettingsResponse = SettingPublic; // list of settings

// Request payload
export type SettingsUpdateSettingData = {
	requestBody: {
		domain: Domain;
		key: string; // allow dynamic keys
		value?: string | number | boolean | Record<string, any>;
		file?: File;
	};
};
// Response payload
export type SettingsUpdateSettingResponse = SettingPublic;
