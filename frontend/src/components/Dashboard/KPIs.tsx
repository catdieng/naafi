import {
	Flex,
	Icon,
	SimpleGrid,
	Stat,
	StatLabel,
	StatValueText,
	Text,
} from "@chakra-ui/react";
import { FiCalendar, FiTrendingUp, FiUsers } from "react-icons/fi";
import type { KPIData } from "@/client";
import { useColorModeValue } from "../ui/color-mode";

interface KPIsProps {
	kpis: KPIData;
}

export default function KPIs({ kpis }: KPIsProps) {
	const boxBg = useColorModeValue("white", "gray.800");
	const boxBorderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const iconColor = useColorModeValue("gray.400", "gray.600");

	return (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5} mb={6}>
			<Stat.Root
				borderWidth="1px"
				borderColor={boxBorderColor}
				p={5}
				rounded="lg"
				bg={boxBg}
				_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
				transition="all 0.2s"
			>
				<Flex justify="space-between" align="start" mb={2}>
					<StatLabel color={textColor} fontSize="sm" fontWeight="medium">
						Revenue
					</StatLabel>
					<Icon as={FiTrendingUp} color={iconColor} fontSize="xl" />
				</Flex>
				<StatValueText fontSize="2xl" fontWeight="bold" color={textColor}>
					€{parseFloat(kpis.revenue_this_month).toFixed(2)}
				</StatValueText>
				<Text fontSize="xs" color={textColor} mt={1}>
					This Month
				</Text>
			</Stat.Root>

			<Stat.Root
				borderWidth="1px"
				borderColor={boxBorderColor}
				p={5}
				rounded="lg"
				bg={boxBg}
				_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
				transition="all 0.2s"
			>
				<Flex justify="space-between" align="start" mb={2}>
					<StatLabel color={textColor} fontSize="sm" fontWeight="medium">
						Appointments
					</StatLabel>
					<Icon as={FiCalendar} color={iconColor} fontSize="xl" />
				</Flex>
				<StatValueText fontSize="2xl" fontWeight="bold" color={textColor}>
					{kpis.appointments_today}
				</StatValueText>
				<Text fontSize="xs" color={textColor} mt={1}>
					Today
				</Text>
			</Stat.Root>

			<Stat.Root
				borderWidth="1px"
				borderColor={boxBorderColor}
				p={5}
				rounded="lg"
				bg={boxBg}
				_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
				transition="all 0.2s"
			>
				<Flex justify="space-between" align="start" mb={2}>
					<StatLabel color={textColor} fontSize="sm" fontWeight="medium">
						Customers
					</StatLabel>
					<Icon as={FiUsers} color={iconColor} fontSize="xl" />
				</Flex>
				<StatValueText fontSize="2xl" fontWeight="bold" color={textColor}>
					{kpis.total_customers}
				</StatValueText>
				<Text fontSize="xs" color={textColor} mt={1}>
					Total
				</Text>
			</Stat.Root>
		</SimpleGrid>
	);
}
