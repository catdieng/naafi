import { endOfDay, startOfDay } from "date-fns";
import { useMemo } from "react";

import type { CalendarEvent, PositionedEvent } from "../engine";
import { computeDayLayout } from "../engine";


export function filterEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter(
    (ev) => !ev.allDay && ev.end > dayStart && ev.start < dayEnd // intersects this day and is not all‑day
  );
}

export function useDayLayout(
  date: Date,
  events: CalendarEvent[],
  startHour: number,
  endHour: number,
  timeSlotCellHeight: number
): { layout: PositionedEvent[] } {
  return useMemo(() => {
    const dayEvents = filterEventsForDay(date, events);
    return { layout: computeDayLayout(date, dayEvents, startHour, endHour, timeSlotCellHeight) };
  }, [date, events, startHour, endHour, timeSlotCellHeight]);
}