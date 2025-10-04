import { z } from "zod";

// Date schema
export const dateSchema = (message = "Invalid date") =>
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
		.refine((val) => !Number.isNaN(Date.parse(val)), {
			message,
		});

// Custom schema for datetime-local input (without seconds and timezone)
export const datetimeLocalSchema = (message = "Invalid datetime") =>
	z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
			"Invalid datetime format (YYYY-MM-DDTHH:mm)",
		)
		.refine((val) => !Number.isNaN(Date.parse(val)), {
			message,
		});

// ISO DateTime schema with timezone
export const isoDateTimeSchema = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}$/,
		"Invalid ISO datetime format with timezone",
	)
	.refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid datetime value",
	});

// Nullable date schema
export const nullableDateSchema = (message = "Invalid date") =>
	z
		.union([
			z.literal(null),
			z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
				.refine((val) => !Number.isNaN(Date.parse(val)), {
					message,
				}),
		])
		.optional();

// Transform function: ISO → datetime-local
export const transformIsoToDatetimeLocal = (isoString: string): string => {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`Invalid ISO date string: ${isoString}`);
	}
	return date.toISOString().slice(0, 16); // Convert to YYYY-MM-DDTHH:mm
};

// Extracts local date and time from a datetime string
export const deriveLocalDateTime = (datetime: string) => {
	const dateObj = new Date(datetime);

	const date = new Date(
		dateObj.getFullYear(),
		dateObj.getMonth(),
		dateObj.getDate(),
	);

	const time = dateObj.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return { date, time };
};
