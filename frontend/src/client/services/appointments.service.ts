import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "../core/CancelablePromise"
import { OpenAPI } from "../core/OpenAPI"

import type {
    AppointmentsCreateAppointmentData,
    AppointmentsCreateAppointmentResponse,
    AppointmentsDeleteAppointmentData,
    AppointmentsDeleteAppointmentResponse,
    AppointmentsReadAppointmentData,
    AppointmentsReadAppointmentResponse,
    AppointmentsReadAppointmentsData,
    AppointmentsReadAppointmentsResponse,
    AppointmentsUpdateAppointmentData,
    AppointmentsUpdateAppointmentResponse,
} from "../types"

export class AppointmentsService {
  /**
   * Read Appointments
   * Retrieve appointments.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns AppointmentsPublic Successful Response
   * @throws ApiError
   */
  public static readAppointments(
    data: AppointmentsReadAppointmentsData = {},
  ): CancelablePromise<AppointmentsReadAppointmentsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appointments/",
      query: {
        start: data.start,
        end: data.end,
        customer_id: data.customer_id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Appointment
   * Create new appointment.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns AppointmentPublic Successful Response
   * @throws ApiError
   */
  public static createAppointment(
    data: AppointmentsCreateAppointmentData,
  ): CancelablePromise<AppointmentsCreateAppointmentResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/appointments/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Appointment
   * Get appointment by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns AppointmentPublic Successful Response
   * @throws ApiError
   */
  public static readAppointment(
    data: AppointmentsReadAppointmentData,
  ): CancelablePromise<AppointmentsReadAppointmentResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appointments/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Appointment
   * Update an appointment.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns AppointmentPublic Successful Response
   * @throws ApiError
   */
  public static updateAppointment(
    data: AppointmentsUpdateAppointmentData,
  ): CancelablePromise<AppointmentsUpdateAppointmentResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/appointments/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete Appointment
   * Delete an appointment.
   * @param data The data for the request.
   * @param data.id
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteAppointment(
    data: AppointmentsDeleteAppointmentData,
  ): CancelablePromise<AppointmentsDeleteAppointmentResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/appointments/{id}/",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
