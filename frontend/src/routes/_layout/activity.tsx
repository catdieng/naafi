import { Box, Container, Flex, Separator } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import KanbanActivity from "@/components/Activity/KanbanActivity";
import PageHeader from "@/components/Common/PageHeader";

export const Route = createFileRoute("/_layout/activity")({
	head: () => ({
		title: "Activity",
		meta: [
			{
				title: "Activity | Naafi",
			},
			{
				name: "description",
				content: "Activity page",
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Box h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Activity" />
			</Flex>
			<Separator mt={2} mb={8} />
			<Container maxW="full" h="100vh" display="flex" flexDirection="column">
				<KanbanActivity />
			</Container>
		</Box>
	);
}
