import { Container, Flex, Heading, Separator, Tabs } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/Common/PageHeader";
import BillingSettings from "@/components/Settings/BillingSettings";
import OrganizationSettings from "@/components/Settings/OrganizationSettings";
import TaxesSettings from "@/components/Settings/TaxesSettings";

export const Route = createFileRoute("/_layout/settings")({
	component: Settings,
});

function Settings() {
	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Settings"
					description="Manage your account settings and preferences"
				/>
			</Flex>
			<Tabs.Root defaultValue="general" variant="subtle">
				<Tabs.List>
					<Tabs.Trigger value="general">General</Tabs.Trigger>
					<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
					<Tabs.Trigger value="taxes">Taxes</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="general">
					<Heading size="md" mb={4}>
						Organization
					</Heading>
					Manage your organization settings
					<Separator my={4} />
					<OrganizationSettings />
				</Tabs.Content>
				<Tabs.Content value="billing">
					<Heading size="md" mb={4}>
						Billing
					</Heading>
					Manage your billing information
					<Separator my={4} />
					<BillingSettings />
				</Tabs.Content>
				<Tabs.Content value="taxes">
					<Heading size="md" mb={4}>
						Taxes
					</Heading>
					Manage your taxes and their details
					<Separator my={4} />
					<TaxesSettings />
				</Tabs.Content>
			</Tabs.Root>
		</Container>
	);
}
