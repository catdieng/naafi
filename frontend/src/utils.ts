import type { ApiError } from "./client";
import useCustomToast from "./hooks/useCustomToast";

export const emailPattern = {
	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	message: "Invalid email address",
};

export const namePattern = {
	value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
	message: "Invalid name",
};

export const telPattern = {
	value: /^\+?[0-9\s\-().]{7,20}$/,
	message: "Invalid phone number",
};

export const passwordRules = (isRequired = true) => {
	const rules: any = {
		minLength: {
			value: 8,
			message: "Password must be at least 8 characters",
		},
	};

	if (isRequired) {
		rules.required = "Password is required";
	}

	return rules;
};

export const confirmPasswordRules = (
	getValues: () => any,
	isRequired = true,
) => {
	const rules: any = {
		validate: (value: string) => {
			const password = getValues().password || getValues().new_password;
			return value === password ? true : "The passwords do not match";
		},
	};

	if (isRequired) {
		rules.required = "Password confirmation is required";
	}

	return rules;
};

export const handleError = (err: ApiError) => {
	const { showErrorToast } = useCustomToast();
	const errDetail = (err.body as any)?.detail;
	let errorMessage = errDetail || "Something went wrong.";
	if (Array.isArray(errDetail) && errDetail.length > 0) {
		errorMessage = errDetail[0].msg;
	}
	showErrorToast(errorMessage);
};

export type StringOrDate = string | Date;

export function dateToDatetimeLocal(value: StringOrDate): string {
	const date = value instanceof Date ? value : new Date(value);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date value");
	}

	const pad = (n: number) => n.toString().padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
