import { Box, Grid } from "@chakra-ui/react";
import {
	addDays,
	addWeeks,
	endOfMonth,
	format,
	startOfMonth,
	startOfWeek,
} from "date-fns";

import { useColorModeValue } from "../../ui/color-mode";
import { getEventSegmentsForWeek } from "../engine";
import { useCalendar } from "../hooks/useCalendar";
import { MonthDayCell } from "./MonthDayCell";
import { MonthEventBlock } from "./MonthEventBlock";

const ROW_HEIGHT = 22;
const HEADER_HEIGHT = 28;
const DAY_NUMBER_HEIGHT = 28;

export function MonthView() {
	const { currentDate, events, locale, onEventClick, weekStartsOn } =
		useCalendar();
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const headerBg = useColorModeValue("gray.50", "gray.800");
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);

	const gridStart = startOfWeek(monthStart, { weekStartsOn });
	const lastWeekStart = startOfWeek(monthEnd, { weekStartsOn });

	const weeks: Date[] = [];
	for (let d = new Date(gridStart); d <= lastWeekStart; d = addWeeks(d, 1)) {
		weeks.push(new Date(d));
	}

	return (
		<Box
			h="100%"
			display="flex"
			flexDirection="column"
			gap={0}
			borderRadius="md"
			borderWidth="1px"
			borderColor={borderColor}
			overflow="hidden"
		>
			{/* Weekday header (locale-aware via date-fns) */}
			<Grid
				templateColumns="repeat(7, 1fr)"
				flexShrink={0}
				h={`${HEADER_HEIGHT}px`}
				borderBottomWidth="1px"
				borderColor={borderColor}
				bg={headerBg}
			>
				{Array.from({ length: 7 }, (_, i) => {
					const day = addDays(gridStart, i);
					return (
						<Box
							key={day.toISOString()}
							p={1}
							fontSize="xs"
							fontWeight="semibold"
							textAlign="center"
						>
							{format(day, "EEE", { locale: locale ?? undefined })}
						</Box>
					);
				})}
			</Grid>

			<Box flex="1" display="flex" flexDirection="column" minH={0}>
				{weeks.map((weekStart) => {
					const days = Array.from({ length: 7 }).map((_, i) =>
						addDays(weekStart, i),
					);

					const segments = getEventSegmentsForWeek(weekStart, events);
					const segmentRowCount = Math.max(
						1,
						...segments.map((s) => (s.row ?? 0) + 1),
						0,
					);
					const contentHeight =
						DAY_NUMBER_HEIGHT + segmentRowCount * ROW_HEIGHT;

					return (
						<Box
							key={weekStart.toISOString()}
							position="relative"
							flex="1"
							minH={`${contentHeight}px`}
							borderBottomWidth="1px"
							borderColor={borderColor}
							_last={{ borderBottomWidth: 0 }}
						>
							{/* Grid of days */}
							<Grid
								templateColumns="repeat(7, 1fr)"
								h="100%"
								minH={`${contentHeight}px`}
							>
								{days.map((day) => (
									<MonthDayCell
										key={day.toISOString()}
										date={day}
										currentDate={currentDate}
									/>
								))}
							</Grid>

							{/* Events overlay (below day numbers) */}
							<Box
								position="absolute"
								top={`${DAY_NUMBER_HEIGHT}px`}
								left={0}
								right={0}
								bottom={0}
								pointerEvents="none"
							>
								{segments.map((seg) => (
									<Box
										key={`${seg.event.id}-${weekStart.toISOString()}`}
										position="absolute"
										left={`${(seg.startCol / 7) * 100}%`}
										width={`${(seg.span / 7) * 100}%`}
										top={`${(seg.row ?? 0) * ROW_HEIGHT}px`}
										height={`${ROW_HEIGHT - 2}px`}
										px={1}
										pointerEvents="auto"
									>
										<MonthEventBlock
											event={seg.event}
											draggableId={`month-${seg.event.id}-${weekStart.getTime()}`}
											onClick={() => onEventClick?.(seg.event)}
										/>
									</Box>
								))}
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
