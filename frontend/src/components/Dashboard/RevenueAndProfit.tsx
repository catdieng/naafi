import {
	Box,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { FiTrendingUp } from "react-icons/fi";
import type { KPIData } from "@/client";
import type { RevenueTrendPoint } from "@/client/types/dashboard.type";
import { useColorModeValue } from "../ui/color-mode";

interface RevenueAndProfitProps {
	kpis: KPIData;
}

export default function RevenueAndProfit({ kpis }: RevenueAndProfitProps) {
	const boxBg = useColorModeValue("white", "gray.800");
	const boxBorderColor = useColorModeValue("gray.200", "gray.700");
	const boxTitleTextColor = useColorModeValue("gray.700", "gray.300");
	const boxTitleIconColor = useColorModeValue("gray.400", "gray.600");

	const revenuePositiveBoxBg = useColorModeValue("green.50", "green.900");
	const revenueNegativeBoxBg = useColorModeValue("orange.50", "orange.900");
	const revenuePositiveBoxBorderColor = useColorModeValue(
		"green.200",
		"green.900",
	);
	const revenueNegativeBoxBorderColor = useColorModeValue(
		"orange.200",
		"orange.900",
	);

	return (
		<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5} mb={6}>
			{/* Revenue Trend Chart */}
			{kpis.revenue_trend && kpis.revenue_trend.length > 0 && (
				<Box
					p={5}
					bg={boxBg}
					borderWidth="1px"
					borderColor={boxBorderColor}
					borderRadius="lg"
				>
					<Flex align="center" mb={4}>
						<Icon
							as={FiTrendingUp}
							color={boxTitleIconColor}
							mr={2}
							fontSize="lg"
						/>
						<Heading size="sm" color={boxTitleTextColor} fontWeight="semibold">
							Revenue Trend (Last 7 Days)
						</Heading>
					</Flex>
					<Flex align="flex-end" gap={3} h="140px" justify="space-between">
						{kpis.revenue_trend.map((point: RevenueTrendPoint) => {
							const revenue = parseFloat(point.revenue);
							const maxRevenue = Math.max(
								...(kpis.revenue_trend || []).map((p: RevenueTrendPoint) =>
									parseFloat(p.revenue),
								),
							);
							const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
							return (
								<Flex
									key={point.date}
									direction="column"
									align="center"
									flex={1}
									gap={2}
								>
									<Box
										bg="linear-gradient(to top, blue.500, blue.400)"
										width="100%"
										borderRadius="md 4px 4px 4px"
										style={{
											height: `${Math.max(height, 8)}%`,
											minHeight: "8px",
										}}
										title={`${point.day}: €${revenue.toFixed(2)}`}
										_hover={{ bg: "blue.600" }}
										transition="all 0.2s"
									/>
									<VStack gap={0}>
										<Text fontSize="xs" color="gray.600" fontWeight="medium">
											{point.day}
										</Text>
										<Text fontSize="xs" fontWeight="bold" color="gray.700">
											€{revenue.toFixed(0)}
										</Text>
									</VStack>
								</Flex>
							);
						})}
					</Flex>
				</Box>
			)}

			{/* Net Profit Summary */}
			{kpis.profit_this_month && (
				<Box
					p={5}
					bg={
						parseFloat(kpis.profit_this_month) >= 0
							? revenuePositiveBoxBg
							: revenueNegativeBoxBg
					}
					borderWidth="1px"
					borderColor={
						parseFloat(kpis.profit_this_month) >= 0
							? revenuePositiveBoxBorderColor
							: revenueNegativeBoxBorderColor
					}
					borderRadius="lg"
				>
					<Flex align="center" mb={3}>
						<Icon
							as={FiTrendingUp}
							color={
								parseFloat(kpis.profit_this_month) >= 0
									? "green.600"
									: "orange.600"
							}
							mr={2}
							fontSize="lg"
						/>
						<Heading
							size="sm"
							color={
								parseFloat(kpis.profit_this_month) >= 0
									? "green.700"
									: "orange.700"
							}
							fontWeight="semibold"
						>
							Net Profit (This Month)
						</Heading>
					</Flex>
					<Text
						fontSize="3xl"
						fontWeight="bold"
						color={
							parseFloat(kpis.profit_this_month) >= 0
								? "green.900"
								: "orange.900"
						}
					>
						€{parseFloat(kpis.profit_this_month).toFixed(2)}
					</Text>
				</Box>
			)}
		</SimpleGrid>
	);
}
