import { Container, Flex } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import AddAppointment from "@/components/Appointments/AddAppointment";
import EditAppointment from "@/components/Appointments/EditAppointment";
import ListAppointments from "@/components/Appointments/ListAppointments";
import { AppointmentProvider } from "@/components/Appointments/ProviderAppointment";
import ShowAppointment from "@/components/Appointments/ShowAppointment";
import PageHeader from "@/components/Common/PageHeader";

export const Route = createFileRoute("/_layout/calendar")({
	head: () => ({
		title: "Calendar",
		meta: [
			{ title: "Calendar | Naafi" },
			{
				name: "description",
				content: "Calendar page",
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container maxW="full" h="100vh" display="flex" flexDirection="column">
			<AppointmentProvider>
				<Flex justifyContent="space-between" alignItems="center" mb={4}>
					<PageHeader
						title="Calendar"
						description="Manages your business schedules"
					/>
					<AddAppointment />
				</Flex>

				<ListAppointments />
				<EditAppointment />
				<ShowAppointment />
			</AppointmentProvider>
		</Container>
	);
}
