import {
	Box,
	Container,
	Flex,
	Separator,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type KPIData, OpenAPI } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import PageHeader from "@/components/Common/PageHeader";
import Agenda from "@/components/Dashboard/Agenda";
import AlertsAndReminders from "@/components/Dashboard/AlertsAndReminders";
import KPIs from "@/components/Dashboard/KPIs";
import QuickActions from "@/components/Dashboard/QuickActions";
import RevenueAndProfit from "@/components/Dashboard/RevenueAndProfit";
import NoOrganization from "@/components/Organizations/NoOrganization";
import useAuth from "@/hooks/useAuth";
import { handleError } from "@/utils";

export const Route = createFileRoute("/_layout/dashboard")({
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

	return (
		<Box h="100vh" display="flex" flexDirection="column">
			{/* Header */}
			<Flex justify="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Dashboard" />
			</Flex>
			<Separator size="xs" mt={2} mb={8} />
			<Container maxW="full">
				{/* Quick Actions & Alerts Row */}
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5} mb={6}>
					{/* Quick Actions Widget */}
					<QuickActions />
					{/* Alerts Widget */}
					<AlertsAndReminders kpis={kpis} />
				</SimpleGrid>

				{/* Essential KPI Cards - MVP */}
				<KPIs kpis={kpis} />

				{/* Revenue Trend & Net Profit */}
				<RevenueAndProfit kpis={kpis} />

				{/* Agenda Table */}
				<Agenda kpis={kpis} />
			</Container>
		</Box>
	);
};
