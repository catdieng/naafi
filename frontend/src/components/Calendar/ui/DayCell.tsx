import { Box } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/react";
import { isSameDay } from "date-fns";
import { useState, type MouseEvent } from "react";

import { useColorModeValue } from "../../ui/color-mode";
import { useCalendar } from "../hooks/useCalendar";
import type { VirtualSlot } from "../hooks/useCalendarState";
import type { DayLayout } from "../hooks/useWeekLayout";
import { isPointerOverCalendarTimeEvent } from "./EventBlock";

type DayCellProps = {
  day: DayLayout;
  isLast?: boolean;
};

export function DayCell({ day, isLast }: DayCellProps) {
  const { ref } = useDroppable({
    id: day.date.toISOString(),
    data: { date: day.date },
  });

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverSlotBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const {
    onCellClick,
    rowsPerHour,
    slotDurationMinutes,
    slotIntervalMinutes,
    slotRowHeight,
    startHour,
    totalSlotRows,
  } = useCalendar();

  const [hoverSlot, setHoverSlot] = useState<VirtualSlot | null>(null);

  function getSlotRangeFromOffsetY(offsetY: number): VirtualSlot | null {
    const slotIndex = Math.floor(offsetY / slotRowHeight);
    const clamped = Math.max(0, Math.min(slotIndex, totalSlotRows - 1));
    const hour = startHour + Math.floor(clamped / rowsPerHour);
    const minute = (clamped % rowsPerHour) * slotIntervalMinutes;
    const start = new Date(day.date);
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + slotDurationMinutes);
    return { start, end };
  }

  const handleCellClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const range = getSlotRangeFromOffsetY(offsetY);
    if (range) {
      onCellClick?.(range);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isPointerOverCalendarTimeEvent(e.target)) {
      setHoverSlot(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    setHoverSlot(getSlotRangeFromOffsetY(offsetY));
  };

  const handleMouseLeave = () => setHoverSlot(null);

  const slotIndexForHover =
    hoverSlot && isSameDay(hoverSlot.start, day.date)
      ? ((hoverSlot.start.getHours() - startHour) * 60 + hoverSlot.start.getMinutes()) /
        slotIntervalMinutes
      : 0;
  const hoverTopPx = slotIndexForHover * slotRowHeight;
  const showHover = hoverSlot && isSameDay(hoverSlot.start, day.date);

  return (
    <Box
      ref={ref}
      position="relative"
      borderRight={isLast ? "none" : "1px solid"}
      borderColor={borderColor}
      cursor="pointer"
      onClick={handleCellClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: totalSlotRows }, (_, i) => {
        const hour = startHour + Math.floor(i / rowsPerHour);
        const minute = (i % rowsPerHour) * slotIntervalMinutes;
        return (
        <Box
          key={`${day.date.toISOString()}-${hour}-${minute}`}
          h={`${slotRowHeight}px`}
          borderBottom="1px solid"
          borderColor={borderColor}
        />
        );
      })}
      {/* Hover: highlight slot under cursor */}
      {showHover && (
        <Box
          position="absolute"
          left={0}
          right={0}
          top={`${hoverTopPx}px`}
          height={`${slotRowHeight}px`}
          bg={hoverSlotBg}
          borderRadius="md"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}
