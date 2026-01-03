import { Box, HStack, Spinner, VStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SettingsService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
// import ItemImageSetting from "./ItemImageSetting";
import ItemSetting from "./ItemSetting";
import ItemStructuredSetting from "./ItemStructuredSetting";

const OrganizationSettings = () => {
	const queryClient = useQueryClient();
	const [edited, setEdited] = useState("");
	const { showSuccessToast } = useCustomToast();

	const { data, isLoading } = useQuery({
		queryKey: ["settings", "company"],
		queryFn: () => SettingsService.readSettings({ domain: "company" }),
	});

	// Mutation to update a single setting
	const updateMutation = useMutation({
		mutationFn: SettingsService.updateSetting, // expects { domain, key, value?, file? }
		onSuccess: () => {
			showSuccessToast("Setting updated successfully.");
			setEdited("");
			queryClient.invalidateQueries({ queryKey: ["settings", "company"] });
		},
	});

	if (isLoading) {
		return (
			<VStack py={8}>
				<Spinner />
			</VStack>
		);
	}

	const settings = (data ?? {}) as any; // { name: "Acme", logo_url: "...", address: {...}, ... }

	return (
		<Box maxW="container.lg" py={4}>
			<HStack align="start" gap={6}>
				<ItemSetting
					edited={edited}
					label="Name"
					settingKey="name"
					settingValue={settings.name}
					description="The official name of your organization. This will appear on invoices and documents."
					onEdit={(key) => setEdited(key)}
					onSave={(key, value) => {
						console.log("value", value);
						updateMutation.mutate({
							requestBody: {
								domain: "company",
								key,
								value,
							},
						});
					}}
				/>
				{/* <ItemImageSetting
					settingKey="logo_url"
					label="Logo"
					settingValue={settings.logo_url}
					description="Upload your company logo. Supported formats: PNG, JPG. Recommended size: 200x200px."
					onSave={(file) =>
						updateMutation.mutate({
							requestBody: {
								domain: "company",
								key: "logo_url",
								file,
							},
						})
					}
				/> */}
			</HStack>

			<ItemStructuredSetting
				edited={edited}
				label="Address"
				settingKey="address"
				description="The primary business address of your organization, used for billing and legal documents."
				settingValue={{
					street: settings.address.street,
					city: settings.address.city,
					zip: settings.address.zip,
					country: settings.address.country,
				}}
				onEdit={(key) => setEdited(key)}
				onSave={(key, value) =>
					updateMutation.mutate({
						requestBody: {
							domain: "company",
							key,
							value,
						},
					})
				}
			/>

			<ItemSetting
				edited={edited}
				label="Phone"
				settingKey="phone"
				settingValue={settings.phone}
				description="A contact phone number customers can use to reach your organization."
				onEdit={(key) => setEdited(key)}
				onSave={(key, value) =>
					updateMutation.mutate({
						requestBody: {
							domain: "company",
							key,
							value,
						},
					})
				}
			/>

			<ItemSetting
				edited={edited}
				label="Email"
				settingKey="email"
				settingValue={settings.email}
				description="The main contact email for your organization, used in communications and invoices."
				onEdit={(key) => setEdited(key)}
				onSave={(key, value) =>
					updateMutation.mutate({
						requestBody: {
							domain: "company",
							key,
							value,
						},
					})
				}
			/>

			<ItemSetting
				edited={edited}
				label="Website"
				settingKey="website"
				settingValue={settings.website}
				description="Your organization’s website URL. It may appear in customer-facing documents."
				onEdit={(key) => setEdited(key)}
				onSave={(key, value) =>
					updateMutation.mutate({
						requestBody: {
							domain: "company",
							key,
							value,
						},
					})
				}
			/>
		</Box>
	);
};

export default OrganizationSettings;
