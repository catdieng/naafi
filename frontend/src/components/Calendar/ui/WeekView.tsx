import { Box, Grid, Text } from "@chakra-ui/react";
import { differenceInCalendarDays, format, startOfWeek } from "date-fns";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useColorModeValue } from "../../ui/color-mode";
import type { PositionedEvent } from "../engine";
import { getEventSegmentsForWeek } from "../engine";
import { useCalendar } from "../hooks/useCalendar";
import { useWeekLayout } from "../hooks/useWeekLayout";
import { DayCell } from "./DayCell";
import { EventBlock } from "./EventBlock";
import { TimeSlot } from "./TimeSlot";

const ALL_DAY_ROW_HEIGHT = 28;

export function WeekView() {
	const {
		currentDate,
		dayColumnWidthPxRef,
		startHour,
		endHour,
		timeSlotCellHeight,
		totalDays,
		events,
		locale,
		onEventClick,
		weekStartsOn,
	} = useCalendar();

	const nowLineColor = useColorModeValue("red.400", "red.300");
	const allDayEventBgColor = useColorModeValue("gray.100", "gray.900");
	const allDayEventTextColor = useColorModeValue("gray.900", "gray.100");
	const allDayBorderColor = useColorModeValue("gray.300", "gray.700");
	const allDayEventHoverBg = useColorModeValue("black", "white");
	const allDayEventHoverColor = useColorModeValue("white", "black");
	const allDayEventHoverBorder = useColorModeValue("gray.800", "gray.200");

	const [now, setNow] = useState<Date>(new Date());
	const daysGridRef = useRef<HTMLDivElement>(null);

	/** Report day column width (px) so resize-width can convert transform.x to days */
	useLayoutEffect(() => {
		const el = daysGridRef.current;
		if (!el || totalDays <= 0) {
			if (dayColumnWidthPxRef) dayColumnWidthPxRef.current = null;
			return;
		}
		const update = () => {
			const w = el.getBoundingClientRect().width / totalDays;
			if (dayColumnWidthPxRef) dayColumnWidthPxRef.current = w;
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [totalDays, dayColumnWidthPxRef]);

	/** Events for time grid only: exclude all-day and multi-day (they are shown in the all-day bar) */
	const timeGridEvents = useMemo(
		() =>
			events.filter(
				(e) => !e.allDay && differenceInCalendarDays(e.end, e.start) < 1,
			),
		[events],
	);

	const days = useWeekLayout(
		currentDate,
		timeGridEvents,
		startHour,
		endHour,
		timeSlotCellHeight,
		totalDays,
		weekStartsOn,
	);

	/** Use same week as day grid (from useWeekLayout) so all-day row respects weekStartsOn */
	const weekStart = useMemo(
		() =>
			days.length > 0
				? days[0].date
				: startOfWeek(currentDate, { weekStartsOn }),
		[days, currentDate, weekStartsOn],
	);

	const allDaySegments = useMemo(
		() =>
			getEventSegmentsForWeek(
				weekStart,
				events.filter(
					(e) => e.allDay || differenceInCalendarDays(e.end, e.start) >= 1,
				),
			),
		[weekStart, events],
	);

	const allDayRowCount = useMemo(
		() =>
			allDaySegments.length === 0
				? 0
				: Math.max(...allDaySegments.map((s) => (s.row ?? 0) + 1), 1),
		[allDaySegments],
	);

	const borderColor = useColorModeValue("gray.200", "gray.600");
	const allDayBg = useColorModeValue("gray.50", "gray.800");

	useEffect(() => {
		const id = window.setInterval(() => {
			setNow(new Date());
		}, 60_000);
		return () => window.clearInterval(id);
	}, []);

	return (
		<Box
			borderRadius="md"
			borderWidth="1px"
			borderColor={borderColor}
			display="flex"
			flexDirection="column"
			h="100%"
			overflow="hidden"
		>
			{/* HEADER */}
			<Grid
				templateColumns={`70px repeat(${totalDays}, 1fr)`}
				borderBottomWidth="1px"
				borderColor={borderColor}
				flexShrink={0}
			>
				<Box borderRightWidth="1px" borderColor={borderColor} />
				{days.map((day, index) => (
					<Box
						key={day.date.toISOString()}
						p={2}
						borderRightWidth={index !== totalDays - 1 ? "1px" : "0"}
						borderColor={borderColor}
					>
						<Text fontSize="sm" fontWeight="bold">
							{format(day.date, "EEE dd", { locale: locale ?? undefined })}
						</Text>
					</Box>
				))}
			</Grid>

			{/* ALL-DAY ROW (multi-day events as bars) */}
			{allDayRowCount > 0 && (
				<Box
					flexShrink={0}
					minH={`${allDayRowCount * ALL_DAY_ROW_HEIGHT}px`}
					position="relative"
					borderBottomWidth="1px"
					borderColor={borderColor}
					bg={allDayBg}
				>
					<Grid
						templateColumns={`70px repeat(${totalDays}, 1fr)`}
						h="100%"
						position="relative"
					>
						<Box
							borderRightWidth="1px"
							borderColor={borderColor}
							py={1}
							px={2}
							fontSize="xs"
							fontWeight="semibold"
						>
							All day
						</Box>
						<Box position="relative" gridColumn="2 / -1">
							{allDaySegments.map((seg) => (
								<Box
									key={`${seg.event.id}-allday`}
									position="absolute"
									left={`${(seg.startCol / 7) * 100}%`}
									width={`${(seg.span / 7) * 100}%`}
									top={`${(seg.row ?? 0) * ALL_DAY_ROW_HEIGHT + 4}px`}
									height={`${ALL_DAY_ROW_HEIGHT - 8}px`}
									px={2}
									borderRadius="md"
									borderColor={allDayBorderColor}
									borderWidth="1px"
									bg={allDayEventBgColor}
									color={allDayEventTextColor}
									fontSize="xs"
									cursor="pointer"
									overflow="hidden"
									whiteSpace="nowrap"
									textOverflow="ellipsis"
									transition="background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
									_hover={{
										bg: allDayEventHoverBg,
										color: allDayEventHoverColor,
										borderColor: allDayEventHoverBorder,
									}}
									onClick={(e) => {
										e.stopPropagation();
										onEventClick?.(seg.event);
									}}
								>
									{seg.event.title}
								</Box>
							))}
						</Box>
					</Grid>
				</Box>
			)}

			{/* BODY */}
			<Box flex="1" display="flex" overflowY="auto">
				{/* LEFT: TIME COLUMN */}
				<Box w="70px" borderRight="1px solid" borderColor={borderColor}>
					<TimeSlot />
				</Box>

				{/* RIGHT: DAYS GRID */}
				<Box flex="1" position="relative">
					<Grid
						ref={daysGridRef}
						templateColumns={`repeat(${totalDays}, 1fr)`}
						position="relative"
					>
						{days.map((day, index) => (
							<DayCell
								key={day.date.toISOString()}
								day={day}
								isLast={index === totalDays - 1}
							/>
						))}

						{/* Events from layout */}
						{days.map((day, dayIndex) =>
							day.layout.map((ev: PositionedEvent) => (
								<EventBlock
									key={`${ev.id}-${day.date.toISOString()}`}
									event={ev}
									dayIndex={dayIndex}
									totalDays={totalDays}
									showWidthResize={dayIndex < totalDays - 1}
									onClick={(e) => {
										e.stopPropagation();
										onEventClick?.(ev);
									}}
								/>
							)),
						)}

						{/* Current time indicator (dotted line across week) */}
						{(() => {
							const minutesFromStart =
								(now.getHours() - startHour) * 60 + now.getMinutes();
							const totalMinutes = (endHour - startHour + 1) * 60;
							const dayIndexNow = differenceInCalendarDays(now, weekStart);
							const inWeek = dayIndexNow >= 0 && dayIndexNow < totalDays;
							if (
								!inWeek ||
								minutesFromStart < 0 ||
								minutesFromStart > totalMinutes
							) {
								return null;
							}
							const topPx = (minutesFromStart / 60) * timeSlotCellHeight;
							return (
								<Box
									position="absolute"
									left={0}
									right={0}
									top={`${topPx}px`}
									borderTop="1px dotted"
									borderColor={nowLineColor}
									pointerEvents="none"
								/>
							);
						})()}
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}
