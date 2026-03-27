export interface UpcomingAppointment {
	id: number;
	start: string;
	end: string;
	status: string;
	description: string | null;
	customer_name: string | null;
	vehicle_plate: string | null;
}

export interface RevenueTrendPoint {
	date: string;
	day: string;
	revenue: string;
}

export interface KPIData {
	revenue_this_month: string;
	profit_this_month: string;
	appointments_today: number;
	total_customers: number;
	upcoming_appointments: UpcomingAppointment[];
	upcoming_appointments_soon?: UpcomingAppointment[];
	overdue_invoices_count?: number;
	overdue_invoices_total?: string;
	revenue_trend?: RevenueTrendPoint[];
}
