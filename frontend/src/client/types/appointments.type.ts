import type { z } from "zod";
import type {
	AppointmentCreateSchema,
	AppointmentSchema,
	AppointmentUpdateSchema,
} from "../schemas";
import type { Message } from "./commons.type";

export type AppointmentPublic = z.infer<typeof AppointmentSchema>;
export type AppointmentCreate = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdate = z.infer<typeof AppointmentUpdateSchema>;

export type AppointmentsPublic = {
	results: Array<AppointmentPublic>;
	count: number;
	next: string | number | null;
	previous: string | number | null;
};

export type AppointmentsReadAppointmentsData = {
	start?: string;
	end?: string;
	customer_id?: string;
};

export type AppointmentsReadAppointmentsResponse = AppointmentsPublic;

export type AppointmentsCreateAppointmentData = {
	requestBody: AppointmentCreate;
};

export type AppointmentsCreateAppointmentResponse = AppointmentPublic;

export type AppointmentsReadAppointmentData = {
	id: number;
};

export type AppointmentsReadAppointmentResponse = AppointmentPublic;

export type AppointmentsUpdateAppointmentData = {
	id: number;
	requestBody: AppointmentUpdate;
};

export type AppointmentsUpdateAppointmentResponse = AppointmentPublic;

export type AppointmentsDeleteAppointmentData = {
	id: number;
};

export type AppointmentsDeleteAppointmentResponse = Message;
