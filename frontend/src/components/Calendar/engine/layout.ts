// engine/layout.ts
import {
	addDays,
	differenceInCalendarDays,
	isAfter,
	isBefore,
	startOfDay,
} from "date-fns";
import { assignColumns, buildCollisionGroups, clampEvent } from "./collision";
import type { CalendarEvent, PositionedEvent } from "./types";

/**
 * Compute layout for a single day (pure function, not a hook)
 */
export function computeDayLayout(
	date: Date,
	events: CalendarEvent[],
	startHour: number,
	endHour: number,
	timeSlotCellHeight: number,
): PositionedEvent[] {
	if (!events.length) return [];

	const dayStart = new Date(date);
	dayStart.setHours(startHour, 0, 0, 0);
	const dayEnd = new Date(date);
	dayEnd.setHours(endHour, 0, 0, 0);

	const groups = buildCollisionGroups(events);

	return groups.flatMap((group) => {
		const internal = group.map((ev) => ({ ...ev }));
		const maxColumns = assignColumns(internal);

		return internal
			.map((ev) => {
				const clamped = clampEvent(ev, startHour, endHour);
				if (!clamped) return null;

				const startMinutes =
					(clamped.start.getHours() - startHour) * 60 +
					clamped.start.getMinutes();
				const durationMinutes =
					(clamped.end.getTime() - clamped.start.getTime()) / 60000;
				const width = 100 / maxColumns;

				return {
					...ev,
					top: (startMinutes / 60) * timeSlotCellHeight,
					height: (durationMinutes / 60) * timeSlotCellHeight,
					left: (ev.column ?? 0) * width,
					width,
				};
			})
			.filter(Boolean) as PositionedEvent[];
	});
}

export type WeekSegment = {
	event: CalendarEvent;
	startCol: number;
	span: number;
	row?: number;
};

/** End at midnight (00:00) is treated as exclusive: last day is the previous calendar day */
function getEffectiveEnd(end: Date): Date {
	const atMidnight =
		end.getHours() === 0 &&
		end.getMinutes() === 0 &&
		end.getSeconds() === 0 &&
		end.getMilliseconds() === 0;
	return atMidnight ? addDays(startOfDay(end), -1) : end;
}

export function getEventSegmentsForWeek(
	weekStart: Date,
	events: CalendarEvent[],
): WeekSegment[] {
	const weekEnd = addDays(weekStart, 6);

	const segments: WeekSegment[] = events
		.filter((event) => event.start <= weekEnd && event.end >= weekStart)
		.map((event) => {
			const clippedStart = isBefore(event.start, weekStart)
				? weekStart
				: event.start;

			const effectiveEventEnd = getEffectiveEnd(event.end);
			const clippedEnd = isAfter(event.end, weekEnd)
				? weekEnd
				: isAfter(effectiveEventEnd, weekEnd)
					? weekEnd
					: effectiveEventEnd;

			const startCol = differenceInCalendarDays(clippedStart, weekStart);

			const span = differenceInCalendarDays(clippedEnd, clippedStart) + 1;

			return { event, startCol, span };
		});

	return assignSegmentRows(segments);
}

/** Assign row index to segments so overlapping ones stack vertically */
function assignSegmentRows(segments: WeekSegment[]): WeekSegment[] {
	const byRow: { endCol: number }[] = [];

	const sorted = [...segments].sort(
		(a, b) => a.startCol - b.startCol || b.span - a.span,
	);

	for (const seg of sorted) {
		const endCol = seg.startCol + seg.span;
		let row = 0;
		while (row < byRow.length && byRow[row].endCol > seg.startCol) {
			row++;
		}
		if (row === byRow.length) {
			byRow.push({ endCol: 0 });
		}
		byRow[row].endCol = Math.max(byRow[row].endCol, endCol);
		(seg as WeekSegment).row = row;
	}

	return segments;
}
