import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "../../ui/color-mode";
import { useCalendar } from "../hooks/useCalendar";

export function TimeSlot() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const {
    rowsPerHour,
    slotIntervalMinutes,
    slotRowHeight,
    startHour,
    totalSlotRows,
  } = useCalendar();

  return (
    <Box
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      width="70px"
    >
      {Array.from({ length: totalSlotRows }, (_, i) => {
        const hour = startHour + Math.floor(i / rowsPerHour);
        const minute = (i % rowsPerHour) * slotIntervalMinutes;
        const label =
          minute === 0
            ? `${hour.toString().padStart(2, "0")}:00`
            : `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        return (
          <Box
            key={`${hour}-${minute}`}
            h={`${slotRowHeight}px`}
            borderBottom="1px solid"
            borderColor={borderColor}
            px={2}
            fontSize="xs"
            color={labelColor}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
}