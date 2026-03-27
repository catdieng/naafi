import { Box, Combobox, useListCollection } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	Controller,
} from "react-hook-form";
import { type CustomerPublic, CustomersService } from "@/client";
import AddCustomer from "../Customers/AddCustomer";
import { Field } from "../ui/field";

export interface SelectCustomerProps<TFieldValues extends FieldValues> {
	required?: boolean;
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	label?: string;
	customer?: { id: number; full_name: string } | CustomerPublic | null;
	placeholder?: string;
	onClear?: () => void;
}

export function SelectCustomer<TFieldValues extends FieldValues>({
	required,
	customer,
	name,
	control,
	label,
	placeholder,
	onClear,
}: SelectCustomerProps<TFieldValues>) {
	const queryClient = useQueryClient();

	const { collection, set } = useListCollection<{
		label: string;
		value: number;
	}>({
		initialItems: customer
			? [
					{
						label: customer.full_name,
						value: customer.id,
					},
				]
			: [],
	});

	const { data: customers, isLoading } = useQuery({
		queryFn: () => CustomersService.readCustomers(),
		queryKey: ["customers"],
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

		const data = await CustomersService.readCustomers({ search });

		if (data.results) {
			set(
				data.results.map((el) => ({
					label: el.full_name,
					value: el.id,
				})),
			);
		} else {
			onCustomersLoaded();
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
					value: customer.id,
				},
			]);
		}
	});

	const onCustomersLoaded = useEffectEvent(() => {
		set(
			customers?.results.map((c) => ({ label: c.full_name, value: c.id })) ??
				[],
		);
	});

	useEffect(() => {
		if (customer) {
			onCustomerPropChanged();
		}
	}, [customer]);

	useEffect(() => {
		if (customers) {
			onCustomersLoaded();
		}
	}, [customers]);

	return (
		<Box my={4}>
			<Controller
				control={control}
				name={name}
				rules={{
					required: "Customer is required",
				}}
				render={({ field, fieldState }) => (
					<>
						<Field
							required={required}
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
												value: newCustomer.id,
											},
										]);
										field.onChange(String(newCustomer.id));
									}}
								/>
							}
						>
							<Combobox.Root
								disabled={isLoading}
								defaultValue={customer ? [String(customer.id)] : []}
								collection={collection}
								value={field.value ? [field.value] : []}
								onValueChange={({ value }) => {
									field.onChange(value[0]);
									if (!value[0]) {
										onClear?.();
									}
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
}
