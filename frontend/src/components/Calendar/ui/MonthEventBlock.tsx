import { Badge, Flex, Text } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/react";

import { useColorModeValue } from "../../ui/color-mode";
import type { CalendarEvent } from "../engine";

type Props = {
  event: CalendarEvent;
  draggableId?: string;
  onClick?: () => void;
};

export function MonthEventBlock({ event, draggableId, onClick }: Props) {
  const { ref } = useDraggable({
    id: draggableId ?? event.id,
    data: { eventId: event.id, start: event.start, end: event.end },
  });
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const hoverBg = useColorModeValue("black", "white");
  const hoverColor = useColorModeValue("white", "black");
  const hoverBorder = useColorModeValue("gray.800", "gray.200");

  return (
    <Badge
      ref={ref}
      m={1}
      mt={1}
      p={1}
      display="block"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      cursor="pointer"
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      color={textColor}
      transition="background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
      _hover={{
        bg: hoverBg,
        color: hoverColor,
        borderColor: hoverBorder,
      }}
      onClick={onClick}
    >
      <Flex justify="space-between" align="center" gap={1}>
        <Text fontWeight="medium" truncate color="inherit">
          {event.title}
        </Text>
      </Flex>
    </Badge>
  );
}
