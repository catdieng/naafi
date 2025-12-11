import { useEffect, useEffectEvent, useState } from "react";
import type { View } from "react-big-calendar";

interface UseCalendarRangeReturn {
	currentDate: Date;
	currentView: View;
	selectedRanges: Date[] | undefined;
	minTime: Date;
	maxTime: Date;
	onRangeChange: (range: any) => void;
	onViewChange: (view: View) => void;
	onNavigate: (date: Date) => void;
}

const HOURS = { start: 8, end: 20 };

const setHour = (date: Date, hour: number) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0);

const getWeekRange = (date: Date): [Date, Date] => {
	const base = new Date(date);
	const day = base.getDay() || 7;

	const first = new Date(base);
	first.setDate(base.getDate() - day + 1);

	const last = new Date(first);
	last.setDate(first.getDate() + 6);

	return [first, last];
};

const getMonthRange = (date: Date): [Date, Date] => {
	const first = new Date(date.getFullYear(), date.getMonth(), 1);
	const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	return [first, last];
};

const normalizeRange = (range: any): [Date, Date] => {
	if (Array.isArray(range)) {
		const first = range[0];
		const last = range[range.length - 1];

		if (first instanceof Date) return [first, last];
		return [first.start, last.end];
	}
	return [range.start, range.end];
};

export const useCalendarRanges = (): UseCalendarRangeReturn => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [currentView, setCurrentView] = useState<View>("week");
	const [selectedRanges, setSelectedRanges] = useState<Date[]>();

	const minTime = setHour(currentDate, HOURS.start);
	const maxTime = setHour(currentDate, HOURS.end);

	const setRanges = (start: Date, end: Date) => {
		setSelectedRanges([setHour(start, HOURS.start), setHour(end, HOURS.end)]);
	};

	const onViewChange = (view: View) => setCurrentView(view);

	const onNavigate = (date: Date) => {
		setCurrentDate(date);

		if (currentView === "month") {
			const [s, e] = getMonthRange(date);
			setRanges(s, e);
		} else if (currentView === "week") {
			const [s, e] = getWeekRange(date);
			setRanges(s, e);
		} else {
			setRanges(date, date);
		}
	};

	const onRangeChange = (range: any) => {
		const [start, end] = normalizeRange(range);
		setRanges(start, end);
	};

	const onNavigateDate = useEffectEvent(() => {
		onNavigate(new Date());
	});

	// initial load
	useEffect(() => {
		onNavigateDate();
	}, []);

	return {
		currentDate,
		currentView,
		selectedRanges,
		minTime,
		maxTime,
		onRangeChange,
		onViewChange,
		onNavigate,
	};
};
