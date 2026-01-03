import { Container, Flex, Spinner, VStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettingsService } from "@/client";
import PageHeader from "@/components/Common/PageHeader";
import ItemSetting from "@/components/Settings/ItemSetting";

export const Route = createFileRoute("/_layout/settings/billing")({
	component: Billing,
});

function Billing() {
	const queryClient = useQueryClient();
	const [edited, setEdited] = useState("");

	const { data, isLoading } = useQuery({
		queryKey: ["settings", "billing"],
		queryFn: () => SettingsService.readSettings({ domain: "billing" }),
	});

	const updateMutation = useMutation({
		mutationFn: SettingsService.updateSetting,
		onSuccess: () => {
			setEdited("");
			queryClient.invalidateQueries({ queryKey: ["settings", "billing"] });
		},
	});

	if (isLoading) {
		return (
			<VStack py={8}>
				<Spinner />
			</VStack>
		);
	}

	const settings = (data ?? {}) as any;

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Billing"
					description="Manage your billing settings and preferences"
				/>
			</Flex>
			<VStack align="start" gap={6}>
				<ItemSetting
					edited={edited}
					label="Invoice prefix"
					settingKey="invoice_prefix"
					settingValue={settings.invoice_prefix}
					description="Prefix to use for invoice numbers (e.g., INV)."
					onEdit={(key) => setEdited(key)}
					onSave={(key, value) =>
						updateMutation.mutate({
							requestBody: { domain: "billing", key, value },
						})
					}
				/>

				<ItemSetting
					edited={edited}
					label="Invoice footer"
					settingKey="invoice_footer"
					settingValue={settings.invoice_footer}
					description="Footer text displayed on invoices (e.g., 'Thank you for your business')."
					onEdit={(key) => setEdited(key)}
					onSave={(key, value) =>
						updateMutation.mutate({
							requestBody: { domain: "billing", key, value },
						})
					}
				/>

				<ItemSetting
					edited={edited}
					label="Invoice notes"
					settingKey="invoice_notes"
					settingValue={settings.invoice_notes}
					description="Additional notes for invoices (e.g., payment instructions or terms)."
					onEdit={(key) => setEdited(key)}
					onSave={(key, value) =>
						updateMutation.mutate({
							requestBody: { domain: "billing", key, value },
						})
					}
				/>

				<ItemSetting
					edited={edited}
					inputType="number"
					label="Due days"
					settingKey="due_days"
					settingValue={settings.due_days}
					description="Number of days until the invoice is due after issuance."
					onEdit={(key) => setEdited(key)}
					onSave={(key, value) =>
						updateMutation.mutate({
							requestBody: { domain: "billing", key, value },
						})
					}
				/>
			</VStack>
		</Container>
	);
}
