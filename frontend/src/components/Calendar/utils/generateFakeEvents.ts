import { addDays, setHours, setMinutes } from "date-fns";
import type { CalendarEvent } from "../engine";

const titles = [
  "Meeting with team",
  "Doctor Appointment",
  "Lunch with John",
  "Project Review",
  "Call Client",
  "Gym",
  "Design Workshop",
  "Daily Standup",
  "Code Review",
  "Interview",
];

export function generateFakeEvents(
  startDate: Date,
  count: number = 20
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const maxOffset = Math.max(7, count); // spread events over at least a week, up to `count` days

  for (let i = 0; i < count; i++) {
    const isMultiDayAllDay = Math.random() < 0.25; // ~25% multi‑day all‑day events
    const title = titles[Math.floor(Math.random() * titles.length)];

    if (isMultiDayAllDay) {
      // Multi‑day all‑day event (used mainly in MonthView)
      const maxStartOffset = Math.max(0, maxOffset - 4); // leave room for up to 4 days
      const startOffset = Math.floor(Math.random() * (maxStartOffset + 1));
      const lengthDays = Math.floor(Math.random() * 3) + 2; // 2–4 days

      const startDay = addDays(startDate, startOffset);
      const endDay = addDays(startDay, lengthDays - 1);

      const start = setMinutes(setHours(startDay, 0), 0); // 00:00
      const end = setMinutes(setHours(endDay, 23), 59); // 23:59

      events.push({
        id: `ev-${i}`,
        title,
        start,
        end,
        allDay: true,
      });
    } else {
      // Regular single‑day timed event
      const dayOffset = Math.floor(Math.random() * maxOffset);

      const startHour = Math.floor(Math.random() * 9) + 8; // 8 → 16
      const startMinute = Math.floor(Math.random() * 4) * 15; // 0,15,30,45

      const durationMinutes =
        (Math.floor(Math.random() * 4) + 2) * 15; // 30 → 75 min

      let start = addDays(startDate, dayOffset);
      start = setHours(start, startHour);
      start = setMinutes(start, startMinute);

      const end = new Date(start.getTime() + durationMinutes * 60000);

      events.push({
        id: `ev-${i}`,
        title,
        start,
        end,
        allDay: false,
      });
    }
  }

  return events;
}