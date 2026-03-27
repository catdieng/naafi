import type { Locale } from "date-fns";
import { createContext } from "react";
import type {
	CalendarCellRange,
	CalendarEvent,
	OnEventClick,
	OnEventDrop,
	OnEventResize,
	OnViewRangeChange,
} from "../engine";
import { useCalendarState } from "../hooks/useCalendarState";
import type { CalendarMessages } from "../types";
import { getCalendarMessages } from "../types";

/** Context value exposed to calendar children. Use for custom headers, bodies, or views. */
export type CalendarContextValue = ReturnType<typeof useCalendarState> & {
	locale?: Locale;
	messages: Required<CalendarMessages>;
	onCellClick?: (range: CalendarCellRange) => void;
	onEventClick?: OnEventClick;
	onEventResize?: OnEventResize;
	onEventDrop?: OnEventDrop;
	onViewRangeChange?: OnViewRangeChange;
};

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({
	children,
	initialDate,
	initialEvents = [],
	locale,
	messages: messagesProp,
	startHour = 0,
	endHour = 23,
	timeSlotCellHeight = 60,
	totalDays = 7,
	slotDurationMinutes = 30,
	weekStartsOn = 0,
	onCellClick,
	onEventClick,
	onEventResize,
	onEventDrop,
	onViewRangeChange,
}: {
	children: React.ReactNode;
	initialDate?: Date;
	initialEvents?: CalendarEvent[];
	locale?: Locale;
	messages?: CalendarMessages;
	startHour?: number;
	endHour?: number;
	timeSlotCellHeight?: number;
	totalDays?: number;
	slotDurationMinutes?: number;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	onCellClick?: (range: CalendarCellRange) => void;
	onEventClick?: OnEventClick;
	onEventResize?: OnEventResize;
	onEventDrop?: OnEventDrop;
	onViewRangeChange?: OnViewRangeChange;
}) {
	const state = useCalendarState({
		initialDate: initialDate ?? new Date(),
		initialEvents,
		startHour,
		endHour,
		timeSlotCellHeight,
		totalDays,
		slotDurationMinutes,
		weekStartsOn,
		onViewRangeChange,
	});

	const messages = getCalendarMessages(messagesProp);

	const value: CalendarContextValue = {
		...state,
		locale,
		messages,
		onCellClick,
		onEventClick,
		onEventResize,
		onEventDrop,
		onViewRangeChange,
	};

	return (
		<CalendarContext.Provider value={value}>
			{children}
		</CalendarContext.Provider>
	);
}
