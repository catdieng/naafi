import { Box } from "@chakra-ui/react";

import CalendarBody from "./CalendarBody";
import CalendarHeader from "./CalendarHeader";
import { CalendarProvider } from "./providers/CalendarProvider";
import type { CalendarProps } from "./types";
import { AgendaView } from "./ui/AgendaView";
import { DayView } from "./ui/DayView";
import { MonthView } from "./ui/MonthView";
import { WeekView } from "./ui/WeekView";

export type {
	CalendarCellRange,
	CalendarViewRange,
	OnCellClick,
	OnEventClick,
	OnEventDrop,
	OnEventResize,
	OnViewRangeChange,
} from "./engine";
export type { CalendarProps } from "./types";

/**
 * Default all-in-one calendar. Renders provider + header + body.
 * For custom layouts, use compound components: Calendar.Root, Calendar.Header, Calendar.Body.
 */
function CalendarRoot({
	initialEvents,
	locale,
	messages,
	startHour = 8,
	endHour = 20,
	timeSlotCellHeight = 100,
	totalDays = 7,
	slotDurationMinutes = 30,
	weekStartsOn = 0,
	onCellClick,
	onEventClick,
	onEventResize,
	onEventDrop,
	onViewRangeChange,
	renderHeader,
	renderBody,
	children,
}: CalendarProps) {
	const events = initialEvents ?? [];
	const content =
		children !== undefined ? (
			children
		) : (
			<Box w="100%" h="100%" p={4}>
				{renderHeader ? renderHeader() : <CalendarHeader />}
				{renderBody ? renderBody() : <CalendarBody />}
			</Box>
		);

	return (
		<Calendar.Provider
			initialEvents={events}
			locale={locale}
			messages={messages}
			startHour={startHour}
			endHour={endHour}
			timeSlotCellHeight={timeSlotCellHeight}
			totalDays={totalDays}
			slotDurationMinutes={slotDurationMinutes}
			weekStartsOn={weekStartsOn}
			onCellClick={onCellClick}
			onEventClick={onEventClick}
			onEventResize={onEventResize}
			onEventDrop={onEventDrop}
			onViewRangeChange={onViewRangeChange}
		>
			{content}
		</Calendar.Provider>
	);
}

/** Compound calendar API. Use Calendar.Root with children to compose or replace header/body. */
const Calendar = Object.assign(CalendarRoot, {
	Provider: CalendarProvider,
	Header: CalendarHeader,
	Body: CalendarBody,
	MonthView,
	WeekView,
	DayView,
	AgendaView,
});

export { Calendar };
export default Calendar;
