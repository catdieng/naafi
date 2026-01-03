import { useState } from "react";

export type IntervalType = "Today" | "Week" | "Month";

export function useIntervalNavigation(initialInterval: IntervalType = "Week") {
	const [intervalType, setIntervalType] =
		useState<IntervalType>(initialInterval);
	const [currentDate, setCurrentDate] = useState(new Date());

	const getInterval = (date: Date, type: IntervalType) => {
		const d = new Date(date);

		if (type === "Today") {
			const start = new Date(d);
			start.setHours(0, 0, 0, 0);
			const end = new Date(d);
			end.setHours(23, 59, 59, 999);
			return { start, end };
		}

		if (type === "Week") {
			const day = d.getDay();
			const diffToMonday = day === 0 ? -6 : 1 - day;
			const start = new Date(d);
			start.setDate(d.getDate() + diffToMonday);
			start.setHours(0, 0, 0, 0);
			const end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);
			return { start, end };
		}

		if (type === "Month") {
			const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
			const end = new Date(
				d.getFullYear(),
				d.getMonth() + 1,
				0,
				23,
				59,
				59,
				999,
			);
			return { start, end };
		}

		return { start: d, end: d };
	};

	const interval = getInterval(currentDate, intervalType);

	const prev = () => {
		const d = new Date(currentDate);
		if (intervalType === "Today") d.setDate(d.getDate() - 1);
		if (intervalType === "Week") d.setDate(d.getDate() - 7);
		if (intervalType === "Month") d.setMonth(d.getMonth() - 1);
		setCurrentDate(d);
	};

	const next = () => {
		const d = new Date(currentDate);
		if (intervalType === "Today") d.setDate(d.getDate() + 1);
		if (intervalType === "Week") d.setDate(d.getDate() + 7);
		if (intervalType === "Month") d.setMonth(d.getMonth() + 1);
		setCurrentDate(d);
	};

	const goToToday = () => {
		setCurrentDate(new Date());
		setIntervalType("Today");
	};

	return {
		intervalType,
		setIntervalType,
		currentDate,
		interval,
		prev,
		next,
		goToToday,
	};
}
