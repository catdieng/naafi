import {
	Badge,
	CloseButton,
	Combobox,
	useListCollection,
	Wrap,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import { type Control, Controller } from "react-hook-form";
import { ItemsService } from "@/client";
import AddItem from "../Items/AddItem";
import { Field } from "../ui/field";

export interface SelectServiceProps {
	name: string;
	control: Control<any>;
	label?: string;
	services?: { label: string; value: string }[];
	placeholder?: string;
}

export const SelectService = ({
	name,
	control,
	label,
	placeholder,
}: SelectServiceProps) => {
	const { data: services } = useQuery({
		queryKey: ["services"],
		queryFn: () => ItemsService.readItemsAll(),
	});

	const { collection, set } = useListCollection<{
		label: string;
		value: string;
	}>({
		initialItems: [],
	});

	const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
		const filteredItems = services
			? services.results.filter((item) => {
					const searchLower = details.inputValue.toLowerCase();
					return item.name.toLowerCase().includes(searchLower);
				})
			: [];
		set(
			filteredItems.map((item) => ({
				label: item.name,
				value: String(item.id),
			})),
		);
	};

	const onServicesLoaded = useEffectEvent(() => {
		if (services) {
			set(
				services.results.map((item) => ({
					label: item.name,
					value: String(item.id),
				})),
			);
		}
	});

	useEffect(() => {
		if (services) {
			onServicesLoaded();
		}
	}, [services]);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<>
					<Field
						label={label}
						invalid={!!fieldState.error}
						errorText={fieldState.error?.message}
						extraActions={
							<AddItem
								appearance="link"
								onItemCreated={(newItem) => {
									set([
										...collection.items,
										{
											label: newItem.name,
											value: String(newItem.id),
										},
									]);
									field.onChange([...field.value, String(newItem.id)]);
								}}
							/>
						}
					>
						<Wrap gap="2">
							{field.value?.map((id: string) => {
								const service = services?.results.find(
									(item) => item.id.toString() === id,
								);
								return service ? (
									<Badge key={id}>
										{service.name}{" "}
										<CloseButton
											size="2xs"
											onClick={() =>
												field.onChange(
													field.value.filter((item: string) => item !== id),
												)
											}
										/>
									</Badge>
								) : null;
							})}
						</Wrap>
						<Combobox.Root
							multiple
							collection={collection}
							value={field.value ?? []}
							onValueChange={({ value }) => {
								field.onChange(value);
							}}
							onInputValueChange={handleInputChange}
						>
							<Combobox.Control>
								<Combobox.Input placeholder={placeholder} />
								<Combobox.IndicatorGroup>
									<Combobox.Trigger />
								</Combobox.IndicatorGroup>
							</Combobox.Control>

							<Combobox.Positioner>
								<Combobox.Content>
									<Combobox.Empty>No services found</Combobox.Empty>
									{collection.items.map((item) => (
										<Combobox.Item key={item.value} item={item}>
											{item.label}
											<Combobox.ItemIndicator />
										</Combobox.Item>
									))}
								</Combobox.Content>
							</Combobox.Positioner>
						</Combobox.Root>
					</Field>
				</>
			)}
		/>
	);
};
