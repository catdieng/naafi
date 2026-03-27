import { Box, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/react";
import { endOfDay, format, isSameDay, isSameMonth, startOfDay } from "date-fns";

import { useColorModeValue } from "../../ui/color-mode";
import { useCalendar } from "../hooks/useCalendar";

type Props = {
  date: Date;
  currentDate: Date;
};

export function getMonthDayDroppableId(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function MonthDayCell({ date, currentDate }: Props) {
  const { ref } = useDroppable({
    id: getMonthDayDroppableId(date),
  });
  const { onCellClick } = useCalendar();

  const isCurrentMonth = isSameMonth(date, currentDate);
  const isToday = isSameDay(date, new Date());

  const bg = useColorModeValue(
    isCurrentMonth ? "white" : "gray.50",
    isCurrentMonth ? "gray.800" : "gray.900"
  );
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleCellClick = () => {
    onCellClick?.({ start: startOfDay(date), end: endOfDay(date) });
  };

  return (
    <Box
      ref={ref}
      borderRightWidth="1px"
      borderColor={borderColor}
      p={2}
      bg={bg}
      position="relative"
      minH="80px"
      cursor={onCellClick ? "pointer" : undefined}
      onClick={onCellClick ? handleCellClick : undefined}
    >
      <Text
        fontSize="sm"
        fontWeight={isToday ? "bold" : "normal"}
        color={isCurrentMonth ? undefined : "gray.500"}
      >
        {date.getDate()}
      </Text>
    </Box>
  );
}