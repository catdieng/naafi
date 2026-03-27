import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FiAlertCircle } from "react-icons/fi";

import type { KPIData } from "@/client/types";
import { useColorModeValue } from "../ui/color-mode";

interface AlertsAndRemindesProps {
	kpis: KPIData;
}

export default function AlertsAndReminders({ kpis }: AlertsAndRemindesProps) {
	const boxBg = useColorModeValue("white", "gray.800");
	const boxBorderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const iconColor = useColorModeValue("gray.400", "gray.600");
	const overdueTextColor = useColorModeValue("gray.700", "red.600");

	const hasAlerts =
		(kpis.overdue_invoices_count && kpis.overdue_invoices_count > 0) ||
		(kpis.upcoming_appointments_soon &&
			kpis.upcoming_appointments_soon.length > 0);

	return hasAlerts ? (
		<Box
			p={5}
			bg={boxBg}
			borderColor={boxBorderColor}
			borderWidth="1px"
			borderRadius="lg"
		>
			<Flex align="center" mb={4}>
				<Icon as={FiAlertCircle} color={iconColor} mr={3} fontSize="xl" />
				<Heading size="sm" color={textColor} fontWeight="semibold">
					Alerts & Reminders
				</Heading>
			</Flex>
			<VStack align="stretch" gap={3}>
				{kpis.overdue_invoices_count && kpis.overdue_invoices_count > 0 && (
					<Flex
						justify="space-between"
						align="center"
						p={3}
						bg={boxBg}
						borderColor={boxBorderColor}
						borderRadius="md"
						borderWidth="1px"
					>
						<Text fontWeight="medium" color={overdueTextColor}>
							{kpis.overdue_invoices_count} Overdue Invoice
							{kpis.overdue_invoices_count > 1 ? "s" : ""}
						</Text>
						<HStack gap={3}>
							<Text color="red.600" fontWeight="bold" fontSize="sm">
								€
								{kpis.overdue_invoices_total
									? parseFloat(kpis.overdue_invoices_total).toFixed(2)
									: "0.00"}
							</Text>
							<Link to="/invoices/">
								<Button size="xs">View</Button>
							</Link>
						</HStack>
					</Flex>
				)}
				{kpis.upcoming_appointments_soon &&
					kpis.upcoming_appointments_soon.length > 0 && (
						<Flex
							justify="space-between"
							align="center"
							p={3}
							bg={boxBg}
							borderRadius="md"
							borderWidth="1px"
							borderColor={boxBorderColor}
						>
							<Text fontWeight="medium" color="gray.700">
								{kpis.upcoming_appointments_soon.length} Appointment
								{kpis.upcoming_appointments_soon.length > 1 ? "s" : ""} starting
								soon (next 2 hours)
							</Text>
							<Link to="/calendar">
								<Button size="xs" variant="ghost">
									View
								</Button>
							</Link>
						</Flex>
					)}
			</VStack>
		</Box>
	) : (
		<Box
			p={5}
			bg={boxBg}
			borderColor={boxBorderColor}
			borderWidth="1px"
			borderRadius="lg"
			boxShadow="sm"
		>
			<Flex align="center" mb={4}>
				<Icon as={FiAlertCircle} color={textColor} mr={3} fontSize="xl" />
				<Heading size="sm" color={textColor} fontWeight="semibold">
					Alerts & Reminders
				</Heading>
			</Flex>
			<Text color={textColor} fontSize="sm">
				No alerts at this time
			</Text>
		</Box>
	);
}
