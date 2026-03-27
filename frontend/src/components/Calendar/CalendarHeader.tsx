import { ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { useCalendar } from "./hooks/useCalendar";

const CalendarHeader = () => {
	const {
		currentDate,
		goToday,
		locale,
		messages,
		next,
		prev,
		view,
		setView,
		viewRange,
	} = useCalendar();

	const formattedMonth = format(currentDate, "MMMM yyyy", {
		locale: locale ?? undefined,
	});

	return (
		<Flex mb={4} align="center" justify="space-between" flexWrap="wrap" gap={2}>
			<Flex align="center" gap={2}>
				<IconButton aria-label="Previous" size="sm" onClick={prev}>
					<FaChevronLeft />
				</IconButton>
				<Flex direction="column">
					<Text fontSize={view === "week" ? "sm" : "lg"} fontWeight="bold">
						{formattedMonth}
					</Text>
					{view === "week" && viewRange && (
						<Text fontSize="xs" color="gray.500">
							{format(viewRange.start, "MMM d", {
								locale: locale ?? undefined,
							})}{" "}
							-{" "}
							{format(viewRange.end, "MMM d", { locale: locale ?? undefined })}
						</Text>
					)}
				</Flex>
				<IconButton aria-label="Next" size="sm" onClick={next}>
					<FaChevronRight />
				</IconButton>

				<ButtonGroup size="sm">
					<Button
						variant={view === "month" ? "solid" : "outline"}
						onClick={() => setView("month")}
					>
						{messages.month}
					</Button>
					<Button
						variant={view === "week" ? "solid" : "outline"}
						onClick={() => setView("week")}
					>
						{messages.week}
					</Button>
					<Button
						variant={view === "day" ? "solid" : "outline"}
						onClick={() => setView("day")}
					>
						{messages.day}
					</Button>
					<Button
						variant={view === "agenda" ? "solid" : "outline"}
						onClick={() => setView("agenda")}
					>
						{messages.agenda}
					</Button>
				</ButtonGroup>
			</Flex>

			<Flex gap={2} align="center">
				<Button size="sm" variant="outline" onClick={goToday}>
					{messages.today}
				</Button>
			</Flex>
		</Flex>
	);
};

export default CalendarHeader;
