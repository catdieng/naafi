import { Badge, Box, Flex, Heading, Icon, Table, Text } from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";
import type { KPIData, UpcomingAppointment } from "@/client";
import { useColorModeValue } from "../ui/color-mode";

interface AgendaProps {
	kpis: KPIData;
}

function getStatusColor(status: string): string {
	switch (status) {
		case "todo":
			return "yellow";
		case "in_progress":
			return "blue";
		case "waiting_parts":
			return "orange";
		case "done":
			return "green";
		case "cancelled":
			return "red";
		default:
			return "gray";
	}
}

export default function Agenda({ kpis }: AgendaProps) {
	const boxBg = useColorModeValue("white", "gray.800");
	const boxBorderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const iconColor = useColorModeValue("gray.400", "gray.600");
	return (
		<Box
			p={5}
			bg={boxBg}
			borderWidth="1px"
			borderColor={boxBorderColor}
			borderRadius="lg"
			overflowX="auto"
		>
			<Flex align="center" mb={4}>
				<Icon as={FiCalendar} color={iconColor} mr={2} fontSize="lg" />
				<Heading size="sm" color={textColor} fontWeight="semibold">
					Today's Agenda
				</Heading>
				<Text fontSize="sm" color={textColor} ml={2}>
					(Next 5 Appointments)
				</Text>
			</Flex>
			{kpis.upcoming_appointments && kpis.upcoming_appointments.length > 0 ? (
				<Table.Root variant="outline" size="sm">
					<Table.Header>
						<Table.Row bg="gray.50">
							<Table.ColumnHeader fontWeight="semibold" color={textColor}>
								Time
							</Table.ColumnHeader>
							<Table.ColumnHeader fontWeight="semibold" color={textColor}>
								Customer
							</Table.ColumnHeader>
							<Table.ColumnHeader fontWeight="semibold" color={textColor}>
								Vehicle
							</Table.ColumnHeader>
							<Table.ColumnHeader fontWeight="semibold" color={textColor}>
								Status
							</Table.ColumnHeader>
							<Table.ColumnHeader fontWeight="semibold" color={textColor}>
								Description
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{kpis.upcoming_appointments.map(
							(appointment: UpcomingAppointment) => (
								<Table.Row
									key={appointment.id}
									_hover={{ bg: "gray.50" }}
									transition="background 0.2s"
								>
									<Table.Cell fontWeight="medium" color={textColor}>
										{new Date(appointment.start).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}{" "}
										-{" "}
										{new Date(appointment.end).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</Table.Cell>
									<Table.Cell color={textColor}>
										{appointment.customer_name || "N/A"}
									</Table.Cell>
									<Table.Cell color={textColor}>
										{appointment.vehicle_plate || "N/A"}
									</Table.Cell>
									<Table.Cell>
										<Badge
											colorScheme={getStatusColor(appointment.status)}
											fontSize="xs"
											px={2}
											py={1}
										>
											{appointment.status.replace("_", " ")}
										</Badge>
									</Table.Cell>
									<Table.Cell color={textColor}>
										{appointment.description || "-"}
									</Table.Cell>
								</Table.Row>
							),
						)}
					</Table.Body>
				</Table.Root>
			) : (
				<Box py={8} textAlign="center">
					<Icon as={FiCalendar} fontSize="3xl" color={textColor} mb={2} />
					<Text color={textColor} fontSize="sm">
						No upcoming appointments for today.
					</Text>
				</Box>
			)}
		</Box>
	);
}
