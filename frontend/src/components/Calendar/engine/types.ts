import type { DragDropEventHandlers } from "@dnd-kit/react";
import type { CalendarView } from "../types";

export type CalendarEvent = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	column?: number;
	color?: string;
};

export type PositionedEvent = CalendarEvent & {
	top: number;
	height: number;
	left: number;
	width: number;
};

export type CalendarCellRange = {
	start: Date;
	end: Date;
};

/** Visible date range for the current view. Passed to onViewRangeChange when view or currentDate changes. */
export type CalendarViewRange = {
	start: Date;
	end: Date;
};

/** Called when the visible range changes (view switch or navigation). Receives start and end of the visible range. */
export type OnViewRangeChange = (range: CalendarViewRange) => void;

/** Called when an event is resized. Receives event id and the new start/end. */
export type OnEventResize = (
	eventId: string,
	newStart: Date,
	newEnd: Date,
) => void;

/** Called when an event is dropped after drag. Receives event id and the new start/end. */
export type OnEventDrop = (
	eventId: string,
	newStart: Date,
	newEnd: Date,
) => void;

/** Called when an event is clicked. Receives the event. */
export type OnEventClick = (event: CalendarEvent) => void;

/** Called when a cell is clicked. Receives the range. */
export type OnCellClick = (range: CalendarCellRange) => void;

export type DragEndEvent = Parameters<
	NonNullable<DragDropEventHandlers["onDragEnd"]>
>[0];

export type CalendarDragEndDeps = {
	view: CalendarView;
	getEventById: (id: string) => CalendarEvent | undefined;
	handleEventDrag: (eventId: string, newStart: Date) => void;
	handleEventResize: (
		eventId: string,
		newEnd?: Date,
		newColumn?: number,
	) => void;
	onEventDrop?: (eventId: string, newStart: Date, newEnd: Date) => void;
	onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
	startHour: number;
	stepMinutes: number;
	timeSlotCellHeight: number;
	dayColumnWidthPxRef: { current: number | null } | null | undefined;
};
