import {
	Badge,
	Box,
	Container,
	Flex,
	Heading,
	SegmentGroup,
	SimpleGrid,
	Stack,
	Stat,
	StatLabel,
	Table,
	Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import NoOrganization from "@/components/Organizations/NoOrganization";
import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user: currentUser } = useAuth();

	return (
		<Container maxW="full">
			{currentUser?.tenant_id ? <DashboardStatic /> : <NoOrganization />}
		</Container>
	);
}

const appointmentsStatic = [
	{
		id: 1,
		start: new Date().setHours(9, 0),
		customer: { full_name: "John Doe" },
		vehicle: { license_plate: "ABC-123" },
		status: "todo",
		description: "Oil change",
		total: 50,
	},
	{
		id: 2,
		start: new Date().setHours(10, 0),
		customer: { full_name: "Jane SmiTable.ColumnHeader" },
		vehicle: { license_plate: "XYZ-987" },
		status: "in_progress",
		description: "Brake check",
		total: 70,
	},
	{
		id: 3,
		start: new Date().setHours(11, 30),
		customer: { full_name: "Bob Johnson" },
		vehicle: { license_plate: "LMN-456" },
		status: "waiting_parts",
		description: "Replace battery",
		total: 120,
	},
	{
		id: 4,
		start: new Date().setHours(13, 0),
		customer: { full_name: "Alice Brown" },
		vehicle: { license_plate: "QRS-321" },
		status: "done",
		description: "Tire rotation",
		total: 40,
	},
	{
		id: 5,
		start: new Date().setHours(15, 0),
		customer: { full_name: "Charlie Green" },
		vehicle: { license_plate: "TUV-654" },
		status: "todo",
		description: "Air filter replacement",
		total: 30,
	},
];

// ---------- Helper ----------
function statusColor(status: sTable.Rowing) {
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
	const [segment, setSegment] = useState<
		"today" | "week" | "monTable.ColumnHeader"
	>("today");

	// KPIs from static data
	const metrics = {
		customers: new Set(appointmentsStatic.map((a) => a.customer.full_name))
			.size,
		appointments: appointmentsStatic.length,
		revenue: appointmentsStatic.reduce((sum, a) => sum + a.total, 0),
	};

	// Filter todo tasks
	const todayTasks = appointmentsStatic.filter((a) => a.status === "todo");

	return (
		<Box p={6}>
			{/* Upper Section */}
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="lg">Dashboard</Heading>
				<SegmentGroup.Root defaultValue="Today">
					<SegmentGroup.Indicator />
					<SegmentGroup.Items
						items={["Today", "Week", "MonTable.ColumnHeader"]}
					/>
				</SegmentGroup.Root>
			</Flex>

			<SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
				<Stat.Root>
					<StatLabel>Customers</StatLabel>
					<Stat.ValueText>{metrics.customers}</Stat.ValueText>
				</Stat.Root>
				<Stat.Root>
					<StatLabel>Appointments</StatLabel>
					<Stat.ValueText>{metrics.appointments}</Stat.ValueText>
				</Stat.Root>
				<Stat.Root>
					<StatLabel>Revenue</StatLabel>
					<Stat.ValueText>€{metrics.revenue.toFixed(2)}</Stat.ValueText>
				</Stat.Root>
			</SimpleGrid>

			{/* Lower Section */}
			<Flex gap={6}>
				{/* Planning Table */}
				<Box flex={3} p={4} bg="gray.50" borderRadius="md" overflowX="auto">
					<Heading size="md" mb={4}>
						Agenda
					</Heading>
					<Table.Root variant="line">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>Time</Table.ColumnHeader>
								<Table.ColumnHeader>Customer</Table.ColumnHeader>
								<Table.ColumnHeader>Vehicle</Table.ColumnHeader>
								<Table.ColumnHeader>Status</Table.ColumnHeader>
								<Table.ColumnHeader>Description</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{appointmentsStatic.map((a) => (
								<Table.Row key={a.id}>
									<Table.Cell>{new Date(a.start).toLocaleString()}</Table.Cell>
									<Table.Cell>{a.customer.full_name}</Table.Cell>
									<Table.Cell>{a.vehicle.license_plate}</Table.Cell>
									<Table.Cell>
										<Badge colorScheme={statusColor(a.status)}>
											{a.status.replace("_", " ")}
										</Badge>
									</Table.Cell>
									<Table.Cell>{a.description}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Box>

				{/* Todo List Sidebar */}
				<Box flex={1} p={4} bg="gray.100" borderRadius="md" h="fit-content">
					<Heading size="md" mb={4}>
						Todo List
					</Heading>
					<Stack gap={3}>
						{todayTasks.map((task) => (
							<Box key={task.id} p={3} bg="white" borderRadius="md" shadow="sm">
								<Heading size="sm">{task.customer.full_name}</Heading>
								<Text>{task.vehicle.license_plate}</Text>
								<Badge mt={1} colorScheme={statusColor(task.status)}>
									{task.status.replace("_", " ")}
								</Badge>
							</Box>
						))}
					</Stack>
				</Box>
			</Flex>
		</Box>
	);
};
