import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"
import type {
  OrganizationCreateData,
  OrganizationCreateResponse,
} from "../types"

export class OrganizationService {
  /**
   * Create Organization
   * Create a new organization.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns OrganizationCreateResponse Successful Response
   * @throws ApiError
   */
  public static createOrganization(
    data: OrganizationCreateData,
  ): CancelablePromise<OrganizationCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/organizations/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
