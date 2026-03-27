import { addDays, startOfWeek } from "date-fns";
import { useMemo } from "react";
import type { CalendarEvent, PositionedEvent } from "../engine";
import { computeDayLayout, getDayEvents } from "../engine";

export type DayLayout = {
	date: Date;
	layout: PositionedEvent[];
};

/**
 * Compute week layout for the visible range.
 */
export function useWeekLayout(
	date: Date,
	events: CalendarEvent[],
	startHour: number,
	endHour: number,
	timeSlotCellHeight: number,
	totalDays: number,
	weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6,
): DayLayout[] {
	return useMemo(() => {
		const days: DayLayout[] = [];

		const start = startOfWeek(date, { weekStartsOn });

		for (let i = 0; i < totalDays; i++) {
			const d = addDays(start, i);

			const dayEvents = getDayEvents(d, events);
			const layout = computeDayLayout(
				d,
				dayEvents,
				startHour,
				endHour,
				timeSlotCellHeight,
			);

			days.push({ date: d, layout });
		}

		return days;
	}, [
		date,
		events,
		startHour,
		endHour,
		timeSlotCellHeight,
		totalDays,
		weekStartsOn,
	]);
}
