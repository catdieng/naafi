import { request as __request } from "@/client/core/request";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import type {
	AuthLoginData,
	AuthLoginResponse,
	AuthRecoverPasswordData,
	AuthRecoverPasswordHtmlContentData,
	AuthRecoverPasswordHtmlContentResponse,
	AuthRecoverPasswordResponse,
	AuthResetPasswordData,
	AuthResetPasswordResponse,
	AuthTestTokenResponse,
} from "../types/auth.type";

export class AuthService {
	/**
	 * Login Access Token
	 * OAuth2 compatible token login, get an access token for future requests
	 * @param data The data for the request.
	 * @param data.formData
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginAccessToken(
		data: AuthLoginData,
	): CancelablePromise<AuthLoginResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/login/",
			body: data,
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	}

	/**
	 * Test Token
	 * Test access token
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static testToken(): CancelablePromise<AuthTestTokenResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/login/test-token",
		});
	}

	/**
	 * Recover Password
	 * Password Recovery
	 * @param data The data for the request.
	 * @param data.email
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static recoverPassword(
		data: AuthRecoverPasswordData,
	): CancelablePromise<AuthRecoverPasswordResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/password-recovery/{email}",
			path: {
				email: data.email,
			},
			errors: {
				422: "Validation Error",
			},
		});
	}

	/**
	 * Reset Password
	 * Reset password
	 * @param data The data for the request.
	 * @param data.requestBody
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static resetPassword(
		data: AuthResetPasswordData,
	): CancelablePromise<AuthResetPasswordResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/reset-password/",
			body: data.requestBody,
			mediaType: "application/json",
			errors: {
				422: "Validation Error",
			},
		});
	}

	/**
	 * Recover Password Html Content
	 * HTML Content for Password Recovery
	 * @param data The data for the request.
	 * @param data.email
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static recoverPasswordHtmlContent(
		data: AuthRecoverPasswordHtmlContentData,
	): CancelablePromise<AuthRecoverPasswordHtmlContentResponse> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/api/v1/password-recovery-html-content/{email}",
			path: {
				email: data.email,
			},
			errors: {
				422: "Validation Error",
			},
		});
	}
}
