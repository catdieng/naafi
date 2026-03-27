import { useEffect, useMemo, useRef, useState, type MouseEvent, type UIEvent } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/react";
import { format, isSameDay } from "date-fns";
import { useColorModeValue } from "../../ui/color-mode";
import { getAllDayEventsForDay } from "../engine";
import { useCalendar } from "../hooks/useCalendar";
import { useDayLayout } from "../hooks/useDayLayout";
import type { VirtualSlot } from "../hooks/useCalendarState";
import { EventBlock, isPointerOverCalendarTimeEvent } from "./EventBlock";
import { TimeSlot } from "./TimeSlot";

const ALL_DAY_ROW_HEIGHT = 36;

export function DayView() {
  const {
    currentDate,
    endHour,
    events,
    locale,
    onCellClick,
    onEventClick,
    rowsPerHour,
    slotDurationMinutes,
    slotIntervalMinutes,
    slotRowHeight,
    startHour,
    timeSlotCellHeight,
    timeSlots,
    totalSlotRows,
  } = useCalendar();

  const [hoverSlot, setHoverSlot] = useState<VirtualSlot | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  const { layout } = useDayLayout(
    currentDate,
    events,
    startHour,
    endHour,
    timeSlotCellHeight
  );

  const allDayEvents = useMemo(
    () => getAllDayEventsForDay(currentDate, events),
    [currentDate, events]
  );

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const allDayBg = useColorModeValue("gray.50", "gray.800");
  const hoverSlotBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const nowLineColor = useColorModeValue("red.400", "red.300");

  const allDayEventBgColor = useColorModeValue("gray.100", "gray.900");
  const allDayEventTextColor = useColorModeValue("gray.900", "gray.100");
  const allDayBorderColor = useColorModeValue("gray.300", "gray.700");
  const allDayEventHoverBg = useColorModeValue("black", "white");
  const allDayEventHoverColor = useColorModeValue("white", "black");
  const allDayEventHoverBorder = useColorModeValue("gray.800", "gray.200");

  const totalHeight = timeSlots.length * timeSlotCellHeight;

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  function getSlotRangeFromOffsetY(offsetY: number): VirtualSlot | null {
    const slotIndex = Math.floor(offsetY / slotRowHeight);
    const clamped = Math.max(0, Math.min(slotIndex, totalSlotRows - 1));
    const hour = startHour + Math.floor(clamped / rowsPerHour);
    const minute = (clamped % rowsPerHour) * slotIntervalMinutes;
    const start = new Date(currentDate);
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + slotDurationMinutes);
    return { start, end };
  }

  const { ref: dropRef } = useDroppable({
    id: currentDate.toISOString(),
  });

  const timeRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (timeRef.current) {
      timeRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleGridClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const range = getSlotRangeFromOffsetY(offsetY);
    if (range) {
      onCellClick?.(range);
    }
  };

  const handleGridMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isPointerOverCalendarTimeEvent(e.target)) {
      setHoverSlot(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    setHoverSlot(getSlotRangeFromOffsetY(offsetY));
  };

  const handleGridMouseLeave = () => setHoverSlot(null);

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
      <Flex
        h="40px"
        align="center"
        justify="center"
        borderBottomWidth="1px"
        borderColor={borderColor}
        flexShrink={0}
      >
        <Text fontSize="sm" fontWeight="bold">
          {format(currentDate, "EEEE d MMM yyyy", { locale: locale ?? undefined })}
        </Text>
      </Flex>

      {/* ALL-DAY ROW (multi-day / all-day events) */}
      {allDayEvents.length > 0 && (
        <Flex
          flexShrink={0}
          minH={`${ALL_DAY_ROW_HEIGHT}px`}
          align="center"
          gap={2}
          px={2}
          py={1}
          borderBottomWidth="1px"
          borderColor={borderColor}
          bg={allDayBg}
        >
          <Text fontSize="xs" fontWeight="semibold" w="52px" flexShrink={0}>
            All day
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {allDayEvents.map((ev) => (
              <Box
                key={ev.id}
                px={2}
                py={1}
                borderRadius="md"
                borderColor={allDayBorderColor}
                borderWidth="1px"
                bg={allDayEventBgColor}
                color={allDayEventTextColor}
                fontSize="xs"
                cursor="pointer"
                transition="background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
                _hover={{
                  bg: allDayEventHoverBg,
                  color: allDayEventHoverColor,
                  borderColor: allDayEventHoverBorder,
                }}
                onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(ev);
              }}
              >
                {ev.title}
              </Box>
            ))}
          </Flex>
        </Flex>
      )}

      {/* BODY */}
      <Box flex="1" display="flex" overflowY="auto">
        {/* TIME COLUMN */}
        <Box
          ref={timeRef}
          w="70px"
          borderRight="1px solid"
          borderColor={borderColor}
        >
          <TimeSlot />
        </Box>

        {/* EVENTS COLUMN */}
        <Box flex="1" onScroll={handleScroll}>
          <Box
            ref={dropRef}
            position="relative"
            minH={`${totalHeight}px`}
            cursor="pointer"
            onClick={handleGridClick}
            onMouseMove={handleGridMouseMove}
            onMouseLeave={handleGridMouseLeave}
          >
            {/* Background grid: one row per slot interval (e.g. 30 min = 2 rows per hour) */}
            {Array.from({ length: totalSlotRows }, (_, i) => {
              const hour = startHour + Math.floor(i / rowsPerHour);
              const minute = (i % rowsPerHour) * slotIntervalMinutes;
              return (
              <Box
                key={`${hour}-${minute}`}
                h={`${slotRowHeight}px`}
                borderBottom="1px solid"
                borderColor={borderColor}
              />
              );
            })}

            {/* Events */}
            {layout.map((event) => (
              <EventBlock
                key={event.id}
                event={event}
                showWidthResize={false}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
              />
            ))}

            {/* Current time indicator (dotted line) */}
            {isSameDay(currentDate, now) && (() => {
              const minutesFromStart =
                (now.getHours() - startHour) * 60 + now.getMinutes();
              const totalMinutes =
                (endHour - startHour + 1) * 60;
              if (minutesFromStart < 0 || minutesFromStart > totalMinutes) {
                return null;
              }
              const topPx =
                (minutesFromStart / 60) * timeSlotCellHeight;
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

            {/* Hover: highlight 30-min cell under cursor */}
            {hoverSlot && isSameDay(hoverSlot.start, currentDate) && (
                <Box
                  position="absolute"
                  left={0}
                  right={0}
                  top={`${
                    ((hoverSlot.start.getHours() - startHour) * 60 +
                      hoverSlot.start.getMinutes()) /
                    60 *
                    timeSlotCellHeight
                  }px`}
                  height={`${slotRowHeight}px`}
                  bg={hoverSlotBg}
                  borderRadius="md"
                  pointerEvents="none"
                />
              )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}