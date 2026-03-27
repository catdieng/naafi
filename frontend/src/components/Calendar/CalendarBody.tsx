import { DragDropProvider } from "@dnd-kit/react";
import { useMemo } from "react";

import { handleCalendarDragEnd } from "./engine/drag-and-drop";
import { useCalendar } from "./hooks/useCalendar";
import { AgendaView } from "./ui/AgendaView";
import { DayView } from "./ui/DayView";
import { MonthView } from "./ui/MonthView";
import { WeekView } from "./ui/WeekView";

const views = {
  month: MonthView,
  week: WeekView,
  day: DayView,
  agenda: AgendaView,
} as const;

const CalendarBody = () => {
  const {
    dayColumnWidthPxRef,
    getEventById,
    handleEventDrag,
    handleEventResize,
    onEventDrop,
    onEventResize,
    startHour,
    stepMinutes,
    timeSlotCellHeight,
    view,
  } = useCalendar();

  const ViewComponent = useMemo(() => views[view] ?? MonthView, [view]);

  return (
    <DragDropProvider
      onDragEnd={(event) =>
        handleCalendarDragEnd(
          {
            view,
            getEventById,
            handleEventDrag,
            handleEventResize,
            onEventDrop,
            onEventResize,
            startHour,
            stepMinutes,
            timeSlotCellHeight,
            dayColumnWidthPxRef,
          },
          event,
        )
      }
    >
      <ViewComponent />
    </DragDropProvider>
  );
};

export default CalendarBody;
