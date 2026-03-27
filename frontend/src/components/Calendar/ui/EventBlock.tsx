import { Box, Flex, Text } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/react";
import { format } from "date-fns";
import { LuGripHorizontal, LuGripVertical } from "react-icons/lu";

import { useColorModeValue } from "../../ui/color-mode";
import type { PositionedEvent } from "../engine";
import { useCalendar } from "../hooks/useCalendar";

/** Time-grid parents use this to avoid slot-hover while the pointer is over an event (mousemove bubbles). */
export function isPointerOverCalendarTimeEvent(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest("[data-calendar-time-event]") != null;
}

type Props = {
  event: PositionedEvent;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  totalDays?: number;
  dayIndex?: number;
  /** East-edge width resize (week: extend duration). Off on last week column / day view. Default true. */
  showWidthResize?: boolean;
};

export function EventBlock({
  event,
  onClick,
  totalDays,
  dayIndex,
  showWidthResize = true,
}: Props) {
  const { locale } = useCalendar();
  const { ref } = useDraggable({
    id: event.id,
    data: { start: event.start, end: event.end },
  });

  const { ref: resizeHeightRef } = useDraggable({
    id: `resize-height-${event.id}`,
    data: { type: "resize-height", eventId: event.id },
  });

  const { ref: resizeWidthRef } = useDraggable({
    id: `resize-width-${event.id}`,
    data: { type: "resize-width", eventId: event.id },
    disabled: !showWidthResize,
  });

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.100");

  const hoverBg = useColorModeValue("black", "white");
  const hoverColor = useColorModeValue("white", "black");
  const hoverBorder = useColorModeValue("gray.800", "gray.200");
  const resizeHandleHoverBg = useColorModeValue("whiteAlpha.200", "blackAlpha.200");

  const left =
    totalDays !== undefined && dayIndex !== undefined
      ? (100 / totalDays) * dayIndex + (event.left * (100 / totalDays)) / 100
      : event.left;
  const width =
    totalDays !== undefined ? (event.width * (100 / totalDays)) / 100 : event.width;

  return (
    <Box
      ref={ref}
      data-calendar-time-event=""
      position="absolute"
      top={`${event.top}px`}
      left={`${left}%`}
      width={`${width}%`}
      height={`${event.height}px`}
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="md"
      p={1}
      fontSize="xs"
      overflow="hidden"
      cursor="pointer"
      color={textColor}
      _hover={{
        bg: hoverBg,
        color: hoverColor,
        borderColor: hoverBorder,
      }}
      onClick={onClick}
    >
      {/* Event Title — color inherited from root so _hover can switch to white */}
      <Text fontWeight="bold" maxLines={1} color="inherit">
        {event.title}
      </Text>

      {/* Event Time */}
      <Text fontSize="10px" opacity={0.8} color="inherit">
        {format(event.start, "HH:mm", { locale: locale ?? undefined })} – {format(event.end, "HH:mm", { locale: locale ?? undefined })}
      </Text>

      {/* Bottom handle → resize height */}
      <Flex
        ref={resizeHeightRef}
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="16px"
        align="center"
        justify="center"
        cursor="ns-resize"
        _hover={{ bg: resizeHandleHoverBg }}
      >
        <LuGripHorizontal size={14} />
      </Flex>

      {showWidthResize && (
        <Flex
          ref={resizeWidthRef}
          position="absolute"
          top="0"
          bottom="0"
          right="0"
          width="16px"
          align="center"
          justify="center"
          cursor="ew-resize"
          _hover={{ bg: resizeHandleHoverBg }}
        >
          <LuGripVertical size={14} />
        </Flex>
      )}
    </Box>
  );
}