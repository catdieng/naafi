import { useContext } from "react";
import { CalendarContext } from "../providers/CalendarProvider";

export function useCalendar() {
    const ctx = useContext(CalendarContext);
    if (!ctx) throw new Error("useCalendar must be used inside CalendarProvider");
    return ctx;
  }