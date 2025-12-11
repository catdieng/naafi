import { Box, Combobox, useListCollection } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import { type Control, Controller } from "react-hook-form";
import { type CustomerSimplePublic, CustomersService } from "@/client";
import AddCustomer from "../Customers/AddCustomer";
import { Field } from "../ui/field";

export interface SelectCustomerProps {
	name: string;
	control: Control<any>;
	label?: string;
	customer?: CustomerSimplePublic | null;
	placeholder?: string;
}

export const SelectCustomer = ({
	customer,
	name,
	control,
	label,
	placeholder,
}: SelectCustomerProps) => {
	const queryClient = useQueryClient();

	const { collection, set } = useListCollection<{
		label: string;
		value: string;
	}>({
		initialItems: customer
			? [
					{
						label: customer.full_name,
						value: String(customer.id),
					},
				]
			: [],
	});

	const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
		const { inputValue } = details;
		if (inputValue) {
			loadOptions(inputValue);
		}
	};

	const searchCustomers = async (search: string) => {
		if (!search) {
			return [];
		}

		const data = await CustomersService.searchCustomer({ search });

		if (data.results) {
			set(
				data.results.map((el) => ({
					label: el.full_name,
					value: String(el.id),
				})),
			);
		}

		return data.results;
	};

	const loadOptions = async (inputValue: string) => {
		const queryKey = ["customers", { search: inputValue }];

		return queryClient.fetchQuery({
			queryKey,
			queryFn: () => searchCustomers(inputValue),
		});
	};

	const onCustomerPropChanged = useEffectEvent(() => {
		if (customer) {
			set([
				{
					label: customer.full_name,
					value: String(customer.id),
				},
			]);
		}
	});

	useEffect(() => {
		if (customer) {
			onCustomerPropChanged();
		}
	}, [customer]);

	return (
		<Box my={4}>
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
								<AddCustomer
									appearance="link"
									onCustomerCreated={(newCustomer) => {
										set([
											{
												label: newCustomer.full_name,
												value: String(newCustomer.id),
											},
										]);
										field.onChange(String(newCustomer.id));
									}}
								/>
							}
						>
							<Combobox.Root
								defaultValue={customer ? [String(customer.id)] : []}
								collection={collection}
								value={field.value ? [field.value] : []}
								onValueChange={({ value }) => {
									field.onChange(value[0] ?? "");
								}}
								onInputValueChange={handleInputChange}
							>
								<Combobox.Control>
									<Combobox.Input placeholder={placeholder} />
									<Combobox.IndicatorGroup>
										<Combobox.ClearTrigger />
										<Combobox.Trigger />
									</Combobox.IndicatorGroup>
								</Combobox.Control>

								<Combobox.Positioner>
									<Combobox.Content>
										<Combobox.Empty>No customers found</Combobox.Empty>
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
		</Box>
	);
};
