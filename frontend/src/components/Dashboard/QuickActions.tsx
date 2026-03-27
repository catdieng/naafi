import { Box, Heading, HStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaFileInvoice, FaUserPlus } from "react-icons/fa";
import { FiCalendar, FiDollarSign } from "react-icons/fi";

import { Button } from "../ui/button";
import { useColorModeValue } from "../ui/color-mode";

export default function QuickActions() {
	const boxBg = useColorModeValue("white", "gray.800");
	const boxBorderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");

	return (
		<Box
			p={5}
			bg={boxBg}
			borderWidth="1px"
			borderColor={boxBorderColor}
			borderRadius="lg"
		>
			<Heading size="sm" mb={4} color={textColor} fontWeight="semibold">
				Quick Actions
			</Heading>
			<HStack gap={3} flexWrap="wrap">
				<Link to="/invoices/new">
					<Button size="sm">
						<FaFileInvoice />
						Create Invoice
					</Button>
				</Link>
				<Link to="/calendar">
					<Button size="sm">
						<FiCalendar />
						Add Appointment
					</Button>
				</Link>
				<Link to="/customers">
					<Button size="sm">
						<FaUserPlus />
						Add Customer
					</Button>
				</Link>
				<Link to="/expenses">
					<Button size="sm">
						<FiDollarSign />
						Add Expense
					</Button>
				</Link>
			</HStack>
		</Box>
	);
}
