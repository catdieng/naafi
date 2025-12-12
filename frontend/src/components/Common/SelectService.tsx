import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AsyncSelect } from "chakra-react-select";
import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { debounce, ItemsService } from "@/client";
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
	const queryClient = useQueryClient();
	const [serviceList, setServiceList] = useState<
		{ label: string; value: string }[]
	>([]);

	const { data: services } = useQuery({
		queryKey: ["services"],
		queryFn: () => ItemsService.readItemsAll(),
	});

	const loadOptions = useCallback(
		debounce(async (inputValue: string, callback: (options: any[]) => void) => {
			if (!inputValue) return callback(serviceList);

			const options = await queryClient.fetchQuery({
				queryKey: ["services", inputValue],
				queryFn: async () => {
					const { results } = await ItemsService.searchItem({
						search: inputValue,
					});
					return results.map((c) => ({ label: c.name, value: String(c.id) }));
				},
				staleTime: 5 * 60 * 1000, // keep cache
			});

			callback(options);
		}, 300),
		[],
	);

	const onServicesLoaded = useEffectEvent(() => {
		if (services) {
			setServiceList(
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
									setServiceList([
										...serviceList,
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
						<AsyncSelect
							isMulti
							placeholder={placeholder}
							value={(field.value ?? [])
								.map((id: string) => {
									const item = serviceList.find(
										(s) => String(s.value) === String(id),
									);
									return item ?? null;
								})
								.filter(Boolean)}
							onChange={(options) => {
								const ids = options.map((o) => o.value); // extract only IDs
								field.onChange(ids);
							}}
							defaultOptions={serviceList ?? []}
							loadOptions={loadOptions}
						/>
					</Field>
				</>
			)}
		/>
	);
};
