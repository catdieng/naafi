export type {
	CalendarCellRange,
	CalendarEvent,
	CalendarViewRange,
	OnEventClick,
	OnEventDrop,
	OnEventResize,
	OnViewRangeChange,
	PositionedEvent,
} from "./engine";

export type {
	CalendarConfig,
	CalendarView,
	VirtualSlot,
	WeekStartsOn,
} from "./hooks/useCalendarState";

export type { CalendarContextValue } from "./providers/CalendarProvider";

import type { Locale } from "date-fns";
import type {
	CalendarEvent,
	OnCellClick,
	OnEventClick,
	OnEventDrop,
	OnEventResize,
	OnViewRangeChange,
} from "./engine";

/** Optional labels for header buttons and "Today". Use for i18n. */
export type CalendarMessages = {
	today?: string;
	day?: string;
	week?: string;
	month?: string;
	agenda?: string;
};

const defaultMessages: Required<CalendarMessages> = {
	today: "Today",
	day: "Day",
	week: "Week",
	month: "Month",
	agenda: "Agenda",
};

export function getCalendarMessages(
	messages?: CalendarMessages,
): Required<CalendarMessages> {
	return messages ? { ...defaultMessages, ...messages } : defaultMessages;
}

/** Props for the root Calendar component. Supports extension via render props or compound children. */
export type CalendarProps = {
	/** Initial events; if not provided, fake events are generated for demo */
	initialEvents?: CalendarEvent[];
	/** date-fns locale for month/day names and date formatting (e.g. import { fr } from "date-fns/locale"). */
	locale?: Locale;
	/** Labels for "Today" and view buttons (today, day, week, month, agenda). Use for i18n. */
	messages?: CalendarMessages;
	startHour?: number;
	endHour?: number;
	timeSlotCellHeight?: number;
	totalDays?: number;
	/** Duration in minutes for the virtual time slot shown when a cell is clicked in day/week view. Default 30. */
	slotDurationMinutes?: number;
	/** First day of week: 0 = Sunday, 1 = Monday, ... 6 = Saturday. Default 0 (Sunday). */
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	/** Called when a cell is clicked (day in month, or time slot in day/week). Receives the cell's start and end. */
	onCellClick?: OnCellClick;
	/** Called when an event is clicked. Receives the event. */
	onEventClick?: OnEventClick;
	/** Called when an event is resized (height or width handle). Receives event id, new start, new end. */
	onEventResize?: OnEventResize;
	/** Called when an event is dropped after drag. Receives event id, new start, new end. */
	onEventDrop?: OnEventDrop;
	/** Called when the visible range changes (view or current date). Receives start and end of the visible range. */
	onViewRangeChange?: OnViewRangeChange;
	/** Override default header. Use for custom navigation or view switcher. */
	renderHeader?: () => React.ReactNode;
	/** Override default body. Use for custom view layout or single-view apps. */
	renderBody?: () => React.ReactNode;
	/** If provided, replaces default header + body. Use with compound components: Calendar.Header, Calendar.Body, or custom views. */
	children?: React.ReactNode;
};
