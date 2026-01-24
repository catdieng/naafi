import {
	Badge,
	Box,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Separator,
	SimpleGrid,
	Stat,
	StatLabel,
	StatValueText,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FaFileInvoice, FaUserPlus } from "react-icons/fa";
import {
	FiAlertCircle,
	FiCalendar,
	FiDollarSign,
	FiTrendingUp,
	FiUsers,
} from "react-icons/fi";
import { OpenAPI } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import PageHeader from "@/components/Common/PageHeader";
import NoOrganization from "@/components/Organizations/NoOrganization";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { handleError } from "@/utils";

export const Route = createFileRoute("/_layout/")({
	head: () => ({
		title: "Dashboard",
		meta: [
			{ title: "Dashboard | Naafi" },
			{ name: "description", content: "Dashboard page" },
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { user: currentUser } = useAuth();

	return (
		<Box h="100vh" display="flex" flexDirection="column">
			{currentUser?.tenant_id ? <DashboardStatic /> : <NoOrganization />}
		</Box>
	);
}

// Appointment type for agenda
interface UpcomingAppointment {
	id: number;
	start: string;
	end: string;
	status: string;
	description: string | null;
	customer_name: string | null;
	vehicle_plate: string | null;
}

// Revenue trend data point
interface RevenueTrendPoint {
	date: string;
	day: string;
	revenue: string;
}

// KPI Type Definition
interface KPIData {
	revenue_this_month: string;
	profit_this_month: string;
	appointments_today: number;
	total_customers: number;
	upcoming_appointments: UpcomingAppointment[];
	upcoming_appointments_soon?: UpcomingAppointment[];
	overdue_invoices_count?: number;
	overdue_invoices_total?: string;
	revenue_trend?: RevenueTrendPoint[];
}

// Fetch KPIs from API
async function fetchKPIs(): Promise<KPIData> {
	const token = localStorage.getItem("access_token") || "";
	const response = await fetch(`${OpenAPI.BASE}/api/v1/dashboard/kpis/`, {
		method: "GET",
		headers: {
			Authorization: `Token ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to fetch KPIs: ${response.status} ${errorText}`);
	}

	return response.json();
}

// Helper function to get status color
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

const DashboardStatic = () => {
	const {
		data: kpis,
		isLoading,
		error,
	} = useQuery<KPIData, ApiError>({
		queryKey: ["kpis"],
		queryFn: fetchKPIs,
		refetchInterval: 60000, // Refetch every minute
	});

	// Handle errors
	if (error) {
		handleError(error);
	}

	if (isLoading) {
		return (
			<Box p={6}>
				<Text>Loading dashboard data...</Text>
			</Box>
		);
	}

	if (error || !kpis) {
		return (
			<Box p={6}>
				<Text color="red.500">Failed to load dashboard data</Text>
			</Box>
		);
	}

	const hasAlerts =
		(kpis.overdue_invoices_count && kpis.overdue_invoices_count > 0) ||
		(kpis.upcoming_appointments_soon &&
			kpis.upcoming_appointments_soon.length > 0);

	return (
		<Box h="100vh" display="flex" flexDirection="column">
			{/* Header */}
			<Flex justify="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Dashboard" />
			</Flex>
			<Separator mt={2} mb={8} />
			<Container maxW="full">
				{/* Quick Actions & Alerts Row */}
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5} mb={6}>
					{/* Quick Actions Widget */}
					<Box
						p={5}
						bg="white"
						borderWidth="1px"
						borderColor="gray.200"
						borderRadius="lg"
						boxShadow="sm"
					>
						<Heading size="sm" mb={4} color="gray.700" fontWeight="semibold">
							Quick Actions
						</Heading>
						<HStack gap={3} flexWrap="wrap">
							<Link to="/invoices/new">
								<Button size="sm" variant="outline" _hover={{ bg: "blue.50" }}>
									<Icon as={FaFileInvoice} mr={2} />
									Create Invoice
								</Button>
							</Link>
							<Link to="/calendar">
								<Button size="sm" variant="outline" _hover={{ bg: "blue.50" }}>
									<Icon as={FiCalendar} mr={2} />
									Add Appointment
								</Button>
							</Link>
							<Link to="/customers">
								<Button size="sm" variant="outline" _hover={{ bg: "blue.50" }}>
									<Icon as={FaUserPlus} mr={2} />
									Add Customer
								</Button>
							</Link>
							<Link to="/expenses">
								<Button size="sm" variant="outline" _hover={{ bg: "blue.50" }}>
									<Icon as={FiDollarSign} mr={2} />
									Add Expense
								</Button>
							</Link>
						</HStack>
					</Box>

					{/* Alerts Widget */}
					{hasAlerts ? (
						<Box
							p={5}
							bg="orange.50"
							borderWidth="1px"
							borderColor="orange.300"
							borderRadius="lg"
							boxShadow="sm"
						>
							<Flex align="center" mb={4}>
								<Icon
									as={FiAlertCircle}
									color="orange.600"
									mr={3}
									fontSize="xl"
								/>
								<Heading size="sm" color="orange.700" fontWeight="semibold">
									Alerts & Reminders
								</Heading>
							</Flex>
							<VStack align="stretch" gap={3}>
								{kpis.overdue_invoices_count &&
									kpis.overdue_invoices_count > 0 && (
										<Flex
											justify="space-between"
											align="center"
											p={3}
											bg="white"
											borderRadius="md"
											borderWidth="1px"
											borderColor="orange.200"
										>
											<Text fontWeight="medium" color="gray.700">
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
													<Button
														size="xs"
														variant="ghost"
														colorScheme="orange"
													>
														View
													</Button>
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
											bg="white"
											borderRadius="md"
											borderWidth="1px"
											borderColor="orange.200"
										>
											<Text fontWeight="medium" color="gray.700">
												{kpis.upcoming_appointments_soon.length} Appointment
												{kpis.upcoming_appointments_soon.length > 1 ? "s" : ""}{" "}
												starting soon (next 2 hours)
											</Text>
											<Link to="/calendar">
												<Button size="xs" variant="ghost" colorScheme="orange">
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
							bg="gray.50"
							borderWidth="1px"
							borderColor="gray.200"
							borderRadius="lg"
							boxShadow="sm"
						>
							<Flex align="center" mb={4}>
								<Icon
									as={FiAlertCircle}
									color="gray.400"
									mr={3}
									fontSize="xl"
								/>
								<Heading size="sm" color="gray.500" fontWeight="semibold">
									Alerts & Reminders
								</Heading>
							</Flex>
							<Text color="gray.500" fontSize="sm">
								No alerts at this time
							</Text>
						</Box>
					)}
				</SimpleGrid>

				{/* Essential KPI Cards - MVP */}
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5} mb={6}>
					<Stat.Root
						borderWidth="1px"
						borderColor="gray.200"
						p={5}
						rounded="lg"
						bg="white"
						boxShadow="sm"
						_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
						transition="all 0.2s"
					>
						<Flex justify="space-between" align="start" mb={2}>
							<StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
								Revenue
							</StatLabel>
							<Icon as={FiTrendingUp} color="blue.500" fontSize="xl" />
						</Flex>
						<StatValueText fontSize="2xl" fontWeight="bold" color="gray.900">
							€{parseFloat(kpis.revenue_this_month).toFixed(2)}
						</StatValueText>
						<Text fontSize="xs" color="gray.500" mt={1}>
							This Month
						</Text>
					</Stat.Root>

					<Stat.Root
						borderWidth="1px"
						borderColor="gray.200"
						p={5}
						rounded="lg"
						bg="white"
						boxShadow="sm"
						_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
						transition="all 0.2s"
					>
						<Flex justify="space-between" align="start" mb={2}>
							<StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
								Appointments
							</StatLabel>
							<Icon as={FiCalendar} color="purple.500" fontSize="xl" />
						</Flex>
						<StatValueText fontSize="2xl" fontWeight="bold" color="gray.900">
							{kpis.appointments_today}
						</StatValueText>
						<Text fontSize="xs" color="gray.500" mt={1}>
							Today
						</Text>
					</Stat.Root>

					<Stat.Root
						borderWidth="1px"
						borderColor="gray.200"
						p={5}
						rounded="lg"
						bg="white"
						boxShadow="sm"
						_hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
						transition="all 0.2s"
					>
						<Flex justify="space-between" align="start" mb={2}>
							<StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
								Customers
							</StatLabel>
							<Icon as={FiUsers} color="green.500" fontSize="xl" />
						</Flex>
						<StatValueText fontSize="2xl" fontWeight="bold" color="gray.900">
							{kpis.total_customers}
						</StatValueText>
						<Text fontSize="xs" color="gray.500" mt={1}>
							Total
						</Text>
					</Stat.Root>
				</SimpleGrid>

				{/* Revenue Trend & Net Profit */}
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5} mb={6}>
					{/* Revenue Trend Chart */}
					{kpis.revenue_trend && kpis.revenue_trend.length > 0 && (
						<Box
							p={5}
							bg="white"
							borderWidth="1px"
							borderColor="gray.200"
							borderRadius="lg"
							boxShadow="sm"
						>
							<Flex align="center" mb={4}>
								<Icon as={FiTrendingUp} color="blue.500" mr={2} fontSize="lg" />
								<Heading size="sm" color="gray.700" fontWeight="semibold">
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
									const height =
										maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
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
												boxShadow="sm"
												style={{
													height: `${Math.max(height, 8)}%`,
													minHeight: "8px",
												}}
												title={`${point.day}: €${revenue.toFixed(2)}`}
												_hover={{ bg: "blue.600" }}
												transition="all 0.2s"
											/>
											<VStack gap={0}>
												<Text
													fontSize="xs"
													color="gray.600"
													fontWeight="medium"
												>
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
									? "green.50"
									: "orange.50"
							}
							borderWidth="1px"
							borderColor={
								parseFloat(kpis.profit_this_month) >= 0
									? "green.200"
									: "orange.200"
							}
							borderRadius="lg"
							boxShadow="sm"
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

				{/* Agenda Table */}
				<Box
					p={5}
					bg="white"
					borderWidth="1px"
					borderColor="gray.200"
					borderRadius="lg"
					boxShadow="sm"
					overflowX="auto"
				>
					<Flex align="center" mb={4}>
						<Icon as={FiCalendar} color="purple.500" mr={2} fontSize="lg" />
						<Heading size="sm" color="gray.700" fontWeight="semibold">
							Today's Agenda
						</Heading>
						<Text fontSize="sm" color="gray.500" ml={2}>
							(Next 5 Appointments)
						</Text>
					</Flex>
					{kpis.upcoming_appointments &&
					kpis.upcoming_appointments.length > 0 ? (
						<Table.Root variant="outline" size="sm">
							<Table.Header>
								<Table.Row bg="gray.50">
									<Table.ColumnHeader fontWeight="semibold" color="gray.700">
										Time
									</Table.ColumnHeader>
									<Table.ColumnHeader fontWeight="semibold" color="gray.700">
										Customer
									</Table.ColumnHeader>
									<Table.ColumnHeader fontWeight="semibold" color="gray.700">
										Vehicle
									</Table.ColumnHeader>
									<Table.ColumnHeader fontWeight="semibold" color="gray.700">
										Status
									</Table.ColumnHeader>
									<Table.ColumnHeader fontWeight="semibold" color="gray.700">
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
											<Table.Cell fontWeight="medium" color="gray.700">
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
											<Table.Cell color="gray.600">
												{appointment.customer_name || "N/A"}
											</Table.Cell>
											<Table.Cell color="gray.600">
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
											<Table.Cell color="gray.600">
												{appointment.description || "-"}
											</Table.Cell>
										</Table.Row>
									),
								)}
							</Table.Body>
						</Table.Root>
					) : (
						<Box py={8} textAlign="center">
							<Icon as={FiCalendar} fontSize="3xl" color="gray.300" mb={2} />
							<Text color="gray.500" fontSize="sm">
								No upcoming appointments for today.
							</Text>
						</Box>
					)}
				</Box>
			</Container>
		</Box>
	);
};
