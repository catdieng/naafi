import {
	addDays,
	endOfDay,
	endOfMonth,
	endOfWeek,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent, CalendarViewRange } from "../engine";

export type CalendarView = "day" | "week" | "month" | "agenda";

export type VirtualSlot = { start: Date; end: Date };

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalendarConfig = {
	initialDate?: Date;
	initialEvents?: CalendarEvent[];
	startHour: number;
	endHour: number;
	timeSlotCellHeight: number;
	totalDays: number;
	/** Duration in minutes for hover grid / `onCellClick` range (day/week view). Default 30. */
	slotDurationMinutes?: number;
	/** First day of week: 0 = Sunday, 1 = Monday, ... 6 = Saturday. Default 0. */
	weekStartsOn?: WeekStartsOn;
	/** Called when the visible range changes (view or currentDate). Receives start and end. */
	onViewRangeChange?: (range: CalendarViewRange) => void;
};

export function useCalendarState({
	initialDate = new Date(),
	initialEvents = [],
	startHour,
	endHour,
	timeSlotCellHeight,
	totalDays,
	slotDurationMinutes = 30,
	weekStartsOn = 0,
	onViewRangeChange,
}: CalendarConfig) {
	const [currentDate, setCurrentDate] = useState(initialDate);
	const [view, setView] = useState<CalendarView>("week");
	const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
	// `initialEvents` may be loaded async (e.g. via React Query). `useState(initialEvents)`
	// only uses the value on the first render, so we re-sync when it changes.
	useEffect(() => {
		setEvents(initialEvents);
	}, [initialEvents]);
	/** Week view measures and sets this so resize-width can convert transform.x (px) to days */
	const dayColumnWidthPxRef = useRef<number | null>(null);

	const viewRange = useMemo((): CalendarViewRange => {
		const d = currentDate;
		switch (view) {
			case "day":
				return { start: startOfDay(d), end: endOfDay(d) };
			case "week": {
				const weekStart = startOfWeek(d, { weekStartsOn });
				const lastDay = addDays(weekStart, totalDays - 1);
				return { start: startOfDay(weekStart), end: endOfDay(lastDay) };
			}
			case "month":
				return { start: startOfMonth(d), end: endOfMonth(d) };
			case "agenda": {
				const weekStart = startOfWeek(d, { weekStartsOn });
				const weekEnd = endOfWeek(d, { weekStartsOn });
				return { start: startOfDay(weekStart), end: endOfDay(weekEnd) };
			}
			default:
				return { start: startOfDay(d), end: endOfDay(d) };
		}
	}, [currentDate, view, totalDays, weekStartsOn]);

	useEffect(() => {
		onViewRangeChange?.(viewRange);
	}, [viewRange, onViewRangeChange]);

	const shiftDate = useCallback(
		(direction: 1 | -1) => {
			const nextDate = new Date(currentDate);

			switch (view) {
				case "day":
					nextDate.setDate(nextDate.getDate() + direction);
					break;

				case "week":
					nextDate.setDate(nextDate.getDate() + 7 * direction);
					break;

				case "month":
					// Move to 1st to prevent overflow issues (Jan 31 → Mar 3 bug)
					nextDate.setDate(1);
					nextDate.setMonth(nextDate.getMonth() + direction);
					break;
			}

			setCurrentDate(nextDate);
		},
		[currentDate, view],
	);

	const next = useCallback(() => shiftDate(1), [shiftDate]);
	const prev = useCallback(() => shiftDate(-1), [shiftDate]);

	const goToday = useCallback(() => {
		setCurrentDate(() => new Date());
	}, []);

	const stepMinutes = slotDurationMinutes;

	const timeSlots = Array.from(
		{ length: endHour - startHour + 1 },
		(_, i) => i + startHour,
	);

	const totalHeight = timeSlots.length * timeSlotCellHeight;

	/** Grid subdivision: e.g. 30 min => 2 rows per hour */
	const slotIntervalMinutes = slotDurationMinutes;
	const rowsPerHour = 60 / slotIntervalMinutes;
	const slotRowHeight = timeSlotCellHeight / rowsPerHour;
	const totalSlotRows = timeSlots.length * rowsPerHour;

	function handleEventDrag(eventId: string, newStart: Date) {
		setEvents((prev) => {
			return prev.map((ev) => {
				if (ev.id !== eventId) return ev;
				const duration = ev.end.getTime() - ev.start.getTime();
				return {
					...ev,
					start: newStart,
					end: new Date(newStart.getTime() + duration),
				};
			});
		});
	}

	function handleEventResize(
		eventId: string,
		newEnd?: Date,
		newColumn?: number, // for horizontal
	) {
		setEvents((prev) =>
			prev.map((ev) => {
				if (ev.id !== eventId) return ev;

				const updated: typeof ev = { ...ev };

				if (newEnd) updated.end = newEnd;
				if (newColumn !== undefined) updated.column = newColumn;

				return updated;
			}),
		);
	}

	function getEventById(id: string) {
		return events.find((e) => e.id === id);
	}
	return {
		currentDate,
		endHour,
		events,
		rowsPerHour,
		slotDurationMinutes,
		slotIntervalMinutes,
		slotRowHeight,
		startHour,
		stepMinutes,
		timeSlotCellHeight,
		timeSlots,
		totalDays,
		totalHeight,
		totalSlotRows,
		view,
		weekStartsOn,
		viewRange,
		getEventById,
		goToday,
		handleEventDrag,
		handleEventResize,
		next,
		prev,
		setCurrentDate,
		setEvents,
		setView,
		dayColumnWidthPxRef,
	};
}
