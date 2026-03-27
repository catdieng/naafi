import type { CalendarDragEndDeps, DragEndEvent } from "./types";

export type ComputeNewStartParams = {
  originalStart: Date;
  dropDate: Date;
  deltaY: number;
  timeSlotCellHeight: number;
  snapMinutes?: number;
  startHour: number;
};

export function computeNewStart({
  originalStart,
  dropDate,
  deltaY,
  timeSlotCellHeight,
  snapMinutes = 30,
  startHour,
}: ComputeNewStartParams): Date {
  // Convert pixels → minutes
  const deltaMinutes = (deltaY / timeSlotCellHeight) * 60;

  const moved = new Date(originalStart.getTime() + deltaMinutes * 60_000);

  // Apply new date
  const newStart = new Date(dropDate);
  newStart.setHours(moved.getHours(), moved.getMinutes(), 0, 0);

  // Snap
  const minutes = newStart.getMinutes();
  const snapped = Math.round(minutes / snapMinutes) * snapMinutes;
  newStart.setMinutes(snapped);

  // Prevent above startHour
  if (newStart.getHours() < startHour) {
    newStart.setHours(startHour, 0, 0, 0);
  }

  return newStart;
}

function parseLocalDateOnly(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  return new Date(y, m - 1, d);
}

function applyResizeHeight(
  deps: CalendarDragEndDeps,
  eventId: string,
  deltaY: number,
): void {
  const original = deps.getEventById(eventId);
  if (!original) return;

  const minutesDelta = (deltaY / deps.timeSlotCellHeight) * 60;
  const snapped =
    Math.round(minutesDelta / deps.stepMinutes) * deps.stepMinutes;

  const newEnd = new Date(original.end);
  newEnd.setMinutes(newEnd.getMinutes() + snapped);

  if (newEnd <= original.start) return;
  deps.handleEventResize(eventId, newEnd);
  deps.onEventResize?.(eventId, original.start, newEnd);
}

function applyResizeWidth(
  deps: CalendarDragEndDeps,
  eventId: string,
  deltaX: number,
): void {
  const original = deps.getEventById(eventId);
  if (!original) return;

  const dayColumnPx = deps.dayColumnWidthPxRef?.current ?? 100;
  const deltaDays = deltaX / dayColumnPx;
  const durationMinutes =
    (original.end.getTime() - original.start.getTime()) / 60000;
  const minutesInDay = 60 * 24;
  const newDurationMinutes = durationMinutes + deltaDays * minutesInDay;
  const snappedDuration = Math.max(
    deps.stepMinutes,
    Math.round(newDurationMinutes / deps.stepMinutes) * deps.stepMinutes,
  );

  const newEnd = new Date(original.start);
  newEnd.setMinutes(original.start.getMinutes() + snappedDuration);

  if (newEnd <= original.start) return;
  deps.handleEventResize(eventId, newEnd);
  deps.onEventResize?.(eventId, original.start, newEnd);
}

function applyEventMove(
  deps: CalendarDragEndDeps,
  eventId: string,
  targetId: string,
  deltaY: number,
): void {
  const original = deps.getEventById(eventId);
  if (!original) return;

  const durationMs = original.end.getTime() - original.start.getTime();

  let newStart: Date;
  if (deps.view === "month") {
    const dropDay = parseLocalDateOnly(targetId);
    if (!dropDay) return;
    newStart = dropDay;
  } else {
    const dropDate = new Date(targetId);
    newStart = computeNewStart({
      originalStart: original.start,
      dropDate,
      deltaY,
      timeSlotCellHeight: deps.timeSlotCellHeight,
      snapMinutes: deps.stepMinutes,
      startHour: deps.startHour,
    });
  }

  const newEnd = new Date(newStart.getTime() + durationMs);
  deps.handleEventDrag(eventId, newStart);
  deps.onEventDrop?.(eventId, newStart, newEnd);
}

export function handleCalendarDragEnd(
  deps: CalendarDragEndDeps,
  event: DragEndEvent,
): void {
  if (event.canceled) return;

  const { source, target, transform } = event.operation;
  if (!source) return;

  const sourceId = String(source.id);
  const { x: dx, y: dy } = transform;

  if (sourceId.startsWith("resize-height-")) {
    applyResizeHeight(deps, sourceId.replace("resize-height-", ""), dy);
    return;
  }

  if (sourceId.startsWith("resize-width-")) {
    applyResizeWidth(deps, sourceId.replace("resize-width-", ""), dx);
    return;
  }

  if (!target) return;

  const sourceData = source.data as { eventId?: string } | undefined;
  const eventId = (sourceData?.eventId ?? source.id) as string;
  applyEventMove(deps, eventId, String(target.id), dy);
}
