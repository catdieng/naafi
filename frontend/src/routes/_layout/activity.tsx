import { Container, Flex } from "@chakra-ui/react";
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
		<Container maxW="full" h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center">
				<PageHeader title="Activity" description="Manages your activity" />
			</Flex>

			<KanbanActivity />
		</Container>
	);
}
