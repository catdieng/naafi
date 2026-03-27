import { Box, Text, VStack } from "@chakra-ui/react";
import { format, isSameDay } from "date-fns";

import { useColorModeValue } from "../../ui/color-mode";
import type { CalendarEvent } from "../engine";
import { useCalendar } from "../hooks/useCalendar";

export function AgendaView() {
  const { events, locale, onEventClick } = useCalendar();
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const agendaEventBgColor = useColorModeValue("gray.100", "gray.900");
  const agendaEventTextColor = useColorModeValue("gray.900", "gray.100");
  const agendaEventBorderColor = useColorModeValue("gray.300", "gray.700");
  const agendaEventHoverBg = useColorModeValue("black", "white");
  const agendaEventHoverColor = useColorModeValue("white", "black");
  const agendaEventHoverBorder = useColorModeValue("gray.800", "gray.200");

  const days: { date: Date; events: CalendarEvent[] }[] = [];
  sortedEvents.forEach((ev) => {
    let dayGroup = days.find((d) => isSameDay(d.date, ev.start));
    if (!dayGroup) {
      dayGroup = { date: ev.start, events: [] };
      days.push(dayGroup);
    }
    dayGroup.events.push(ev);
  });

  return (
    <VStack gap={4} align="stretch" maxH="100%" overflowY="auto">
      {days.map((day) => (
        <Box key={day.date.toISOString()} borderBottomWidth="1px" borderColor={borderColor} pb={2}>
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            {format(day.date, "EEEE dd MMMM", { locale: locale ?? undefined })}
          </Text>
          <VStack gap={1} align="stretch">
            {day.events.map((ev) => (
              <Box
                key={ev.id}
                p={2}
                borderRadius="md"
                bg={agendaEventBgColor}
                borderColor={agendaEventBorderColor}
                borderWidth="1px"
                color={agendaEventTextColor}
                cursor="pointer"
                transition="background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
                _hover={{
                  bg: agendaEventHoverBg,
                  color: agendaEventHoverColor,
                  borderColor: agendaEventHoverBorder,
                }}
                onClick={() => onEventClick?.(ev)}
              >
                <Text fontWeight="bold" color="inherit">
                  {ev.title}
                </Text>
                <Text fontSize="xs" opacity={0.85} color="inherit">
                  {ev.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {ev.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}