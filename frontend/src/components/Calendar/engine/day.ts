import { endOfDay, startOfDay } from "date-fns";

import type { CalendarEvent } from "./types";
import { overlaps } from "./utils";

export function getDayEvents(
  date: Date,
  events: CalendarEvent[],
): CalendarEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter(
    (ev) => !ev.allDay && overlaps(ev.start, ev.end, dayStart, dayEnd),
  );
}

/** All-day events that intersect the given day (for day/week view all-day strip) */
export function getAllDayEventsForDay(
  date: Date,
  events: CalendarEvent[],
): CalendarEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  return events.filter(
    (ev) => ev.allDay && overlaps(ev.start, ev.end, dayStart, dayEnd),
  );
}
