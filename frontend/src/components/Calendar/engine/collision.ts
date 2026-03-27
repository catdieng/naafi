import type { CalendarEvent, PositionedEvent } from "./types";

// ---------------------------
// 1️⃣ Build overlapping groups
// ---------------------------
export function buildCollisionGroups(events: CalendarEvent[]): CalendarEvent[][] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const groups: CalendarEvent[][] = [];

  let currentGroup: CalendarEvent[] = [];
  let currentGroupEnd: Date | null = null;

  for (const ev of sorted) {
    if (!currentGroup.length) {
      currentGroup = [ev];
      currentGroupEnd = ev.end;
      continue;
    }

    if (ev.start < currentGroupEnd!) {
      currentGroup.push(ev);
      currentGroupEnd = ev.end > currentGroupEnd! ? ev.end : currentGroupEnd;
    } else {
      groups.push(currentGroup);
      currentGroup = [ev];
      currentGroupEnd = ev.end;
    }
  }

  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

// ---------------------------
// 2️⃣ Assign columns in group
// ---------------------------
export function assignColumns(group: CalendarEvent[]): number {
  const active: CalendarEvent[] = [];
  let maxColumns = 0;

  for (const ev of group) {
    // remove finished events
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= ev.start) active.splice(i, 1);
    }

    // find first available column
    const used = new Set(active.map(e => e.column));
    let column = 0;
    while (used.has(column)) column++;

    ev.column = column;
    active.push(ev);
    maxColumns = Math.max(maxColumns, active.length);
  }

  return maxColumns;
}

// ---------------------------
// 3️⃣ Clamp vertical
// ---------------------------
export function clampEvent(ev: CalendarEvent, startHour: number, endHour: number): { start: Date; end: Date } | null {
  const dayStart = new Date(ev.start);
  dayStart.setHours(startHour, 0, 0, 0);
  const dayEnd = new Date(ev.start);
  dayEnd.setHours(endHour, 0, 0, 0);

  const start = ev.start < dayStart ? dayStart : ev.start;
  const end = ev.end > dayEnd ? dayEnd : ev.end;

  if (end <= dayStart || start >= dayEnd) return null;
  return { start, end };
}

// ---------------------------
// 4️⃣ Convert to PositionedEvent
// ---------------------------
function toPositionedEvent(
  ev: CalendarEvent,
  startHour: number,
  endHour: number,              // ✅ ajout
  timeSlotCellHeight: number,
  maxColumns: number
): PositionedEvent | null {
  const clamped = clampEvent(ev, startHour, endHour); // ✅ utilise le paramètre
  if (!clamped) return null;

  const startMinutes = (clamped.start.getHours() - startHour) * 60 + clamped.start.getMinutes();
  const durationMinutes = (clamped.end.getTime() - clamped.start.getTime()) / 60000;
  const width = 100 / maxColumns;

  return {
    ...ev,
    top: (startMinutes / 60) * timeSlotCellHeight,
    height: (durationMinutes / 60) * timeSlotCellHeight,
    left: (ev.column ?? 0) * width,
    width,
  };
}

// ---------------------------
// 5️⃣ Compute layout for a group
// ---------------------------
export function computeGroupLayout(
  group: CalendarEvent[],
  startHour: number,
  endHour: number,               // ✅ ajout
  timeSlotCellHeight: number
): PositionedEvent[] {
  const maxColumns = assignColumns(group);
  return group
    .map((ev) => toPositionedEvent(ev, startHour, endHour, timeSlotCellHeight, maxColumns)) // ✅ passe endHour
    .filter(Boolean) as PositionedEvent[];
}

// ---------------------------
// 6️⃣ Compute full layout
// ---------------------------