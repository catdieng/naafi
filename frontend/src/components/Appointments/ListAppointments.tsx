import { Calendar, dayjsLocalizer, type View } from "react-big-calendar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { type AppointmentPublic, AppointmentsService } from "@/client";
import { useQuery } from "@tanstack/react-query";

import { useAppointmentContext } from "./ProviderAppointment";

const localizer = dayjsLocalizer(dayjs);

export interface ListAppointments {
  onSelectEvent?: (event: AppointmentPublic | undefined) => void;
}

function getAppointments({ start, end }: { start: string; end: string }) {
  return {
    queryFn: () => AppointmentsService.readAppointments({ start, end }),
    queryKey: ["appointments", { start, end }],
  };
}

const ListAppointments = ({ onSelectEvent }: ListAppointments) => {
  const [currentView, setCurrentView] = useState<View>("week");
  const [selectedRanges, setSelectedRanges] = useState<Date[] | undefined>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { setSelectedAppointment, setSelectedSlot } = useAppointmentContext()
  const todayAt8AM = new Date();
  todayAt8AM.setHours(8, 0, 0, 0);

  const todayAt8PM = new Date();
  todayAt8PM.setHours(20, 0, 0, 0);

  const { data: appointments } = useQuery({
    ...getAppointments({
      start: selectedRanges ? selectedRanges[0].toISOString() : "",
      end: selectedRanges ? selectedRanges[1].toISOString() : "",
    }),
    enabled: !!selectedRanges,
  });

  const adjustToHours = (date: Date, hour: number): Date => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(hour, 0, 0, 0);
    return adjustedDate;
  };

  const setRanges = (start: Date, end: Date) => {
    setSelectedRanges([adjustToHours(start, 8), adjustToHours(end, 20)]);
  }

  const onRangeChange = (
    _range: Date[] | { start: Date; end: Date },
  ) => {
    if (Array.isArray(_range)) {
      if (_range.length === 1) {
        setRanges(_range[0],_range[0]);
      } else {
        setRanges(_range[0], _range[_range.length - 1]);
      }
    } else {
      setRanges(_range.start, _range.end);
    }
  };

   useEffect(() => {
    const now = new Date();

    if (currentView === "month") {
      const firstDateOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDateOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      );
      setRanges(firstDateOfMonth, lastDateOfMonth);
    } else if (currentView === "week") {
      const day = now.getDay() || 7;
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - day + 1));
      const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6));

      setRanges(firstDayOfWeek, lastDayOfWeek);
    } else {
      setRanges(todayAt8AM, todayAt8PM);
    }
  }, []);

  return (
    <Calendar      
      view={currentView}
      localizer={localizer}
      date={currentDate}
      events={appointments?.results.map((appointment) => ({
        id: appointment.id,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
      })) || []}
      onSelectEvent={(event) => {
        const selected = appointments?.results.find((a) => a.id === event.id);
        setSelectedAppointment(selected || null)
        if (onSelectEvent) onSelectEvent(selected);
      }}
      onSelectSlot={(slotInfo) => {
        setSelectedAppointment(null);
        setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
      }}
      onView={(view) => setCurrentView(view)}
      onNavigate={(date) => {
        setCurrentDate(date);
      }}
      onRangeChange={onRangeChange}
      style={{ height: "calc(100vh - 180px)", width: "100%" }}
      min={adjustToHours(currentDate, 8)}
      max={adjustToHours(currentDate, 20)}
      selectable
    />
  );
};

export default ListAppointments;
