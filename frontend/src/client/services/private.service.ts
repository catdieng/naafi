import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"
import type { PrivateCreateUserData, PrivateCreateUserResponse } from "../types"

export class PrivateService {
  /**
   * Create User
   * Create a new user.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: PrivateCreateUserData,
  ): CancelablePromise<PrivateCreateUserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/private/users/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
