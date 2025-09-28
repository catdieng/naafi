import type {
	SettingsReadSettingsData,
	SettingsReadSettingsResponse,
	SettingsUpdateSettingData,
	SettingsUpdateSettingResponse,
} from "@/client";
import { request as __request } from "@/client/core/request";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";

export const SettingsService = {
	/**
	 *  Read Settings
	 *  Read setting by domain
	 *  @returns SettingsPublic Successful Response
	 *  @throws ApiError
	 */
	readSettings(
		data: SettingsReadSettingsData = {},
	): CancelablePromise<SettingsReadSettingsResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/api/v1/settings/{domain}/",
			path: {
				domain: data.domain,
			},
			errors: {
				422: "Validation Error",
			},
		});
	},

	/**
	 * Update Setting
	 * Update a setting by domain
	 * @return SettingPublic Successful Response
	 * @throws ApiError
	 */
	updateSetting(
		data: SettingsUpdateSettingData,
	): CancelablePromise<SettingsUpdateSettingResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/settings/{domain}/{key}/",
			path: {
				domain: data.requestBody.domain,
				key: data.requestBody.key,
			},
			body: data.requestBody,
			errors: {
				422: "Validation Error",
			},
		});
	},
};
