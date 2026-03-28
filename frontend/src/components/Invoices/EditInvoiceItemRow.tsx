import {
	Combobox,
	IconButton,
	NumberInput,
	Portal,
	Table,
	Text,
	useListCollection,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import {
	Controller,
	type UseFieldArrayRemove,
	useFormContext,
} from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import type { InvoiceCreate, InvoiceUpdate, ItemPublic } from "@/client";
import { Field } from "../ui/field";

export type EditInvoiceItemRowProps = {
	index: number;
	remove: UseFieldArrayRemove;
	selectedServiceIds: string[];
	services: ItemPublic[];
};

const EditInvoiceItemRow = ({
	index,
	remove,
	selectedServiceIds,
	services,
}: EditInvoiceItemRowProps) => {
	const {
		control,
		formState: { errors },
		setValue,
		watch,
	} = useFormContext<InvoiceCreate | InvoiceUpdate>();
	// Watch all rows to compute selected IDs
	const serviceId = watch(`items.${index}.service_id`) ?? "";
	const quantity = watch(`items.${index}.quantity`);
	const unitPrice = watch(`items.${index}.unit_price`);

	// Filter services to exclude IDs already selected in other rows
	const availableServices = useMemo(() => {
		return services.filter(
			(s) =>
				!selectedServiceIds.includes(String(s.id)) ||
				String(s.id) === serviceId,
		);
	}, [selectedServiceIds, serviceId, services]);

	const { collection, set } = useListCollection<{
		label: string;
		value: string;
	}>({
		initialItems: availableServices?.map((el) => ({
			label: el.name,
			value: String(el.id),
		})),
	});

	//
	useEffect(() => {
		set(
			availableServices.map((s) => ({
				label: s.name,
				value: String(s.id),
			})),
		);
	}, [availableServices, set]);

	const handleServiceChange = useCallback(
		(serviceId: string) => {
			console.log("handleServiceChange", serviceId);
			if (serviceId) {
				const service = services.find((s) => String(s.id) === serviceId);
				if (service) {
					setValue(`items.${index}.unit_price`, String(service.price));
				}
			} else {
				setValue(`items.${index}.unit_price`, "0");
			}
			setValue(`items.${index}.service_id`, serviceId);
		},
		[index, services, setValue],
	);

	const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
		let filteredItems: {
			label: string;
			value: string;
		}[] = [];
		if (details.inputValue.length) {
			filteredItems =
				services
					?.filter((item) => {
						return item.name
							.toLowerCase()
							.includes(details.inputValue.toLowerCase());
					})
					.map((el) => ({ label: el.name, value: String(el.id) })) || [];
		} else {
			filteredItems =
				services?.map((el) => ({
					label: el.name,
					value: String(el.id),
				})) || [];
		}

		set(filteredItems);
	};

	const handleClearSelection = useCallback(() => {
		setValue(`items.${index}.service_id`, "");
		setValue(`items.${index}.unit_price`, "0");
	}, [setValue, index]);

	const calculateTotal = useCallback(() => {
		const qty = parseFloat(quantity || "0");
		const price = parseFloat(unitPrice || "0");
		return (qty * price).toFixed(2);
	}, [quantity, unitPrice]);

	return (
		<Table.Row>
			<Table.Cell>
				<Field
					required
					invalid={!!errors.items?.[index]?.service_id}
					errorText={errors.items?.[index]?.service_id?.message}
				>
					<Controller
						control={control}
						name={`items.${index}.service_id`}
						render={({ field }) => (
							<Combobox.Root
								size="xs"
								defaultValue={field.value ? [String(field.value)] : []}
								collection={collection}
								value={field.value ? [String(field.value)] : []}
								onValueChange={({ value }) => {
									console.log("onChange", value);
									handleServiceChange(value[0]);
									field.onChange(value[0] ?? "");
								}}
								onInputValueChange={handleInputChange}
							>
								<Combobox.Control>
									<Combobox.Input placeholder="Search a service" />
									<Combobox.IndicatorGroup>
										<Combobox.ClearTrigger
											aria-label="Clear selection"
											onClick={handleClearSelection}
										/>
										<Combobox.Trigger aria-label="Toggle services list" />
									</Combobox.IndicatorGroup>
								</Combobox.Control>
								<Portal>
									<Combobox.Positioner>
										<Combobox.Content>
											<Combobox.Empty>No Services found</Combobox.Empty>
											{collection.items.map((item) => (
												<Combobox.Item key={item.value} item={item}>
													{item.label}
													<Combobox.ItemIndicator />
												</Combobox.Item>
											))}
										</Combobox.Content>
									</Combobox.Positioner>
								</Portal>
							</Combobox.Root>
						)}
					/>
				</Field>
			</Table.Cell>

			<Table.Cell>
				<Field
					required
					invalid={!!errors.items?.[index]?.quantity}
					errorText={errors.items?.[index]?.quantity?.message}
				>
					<Controller
						control={control}
						name={`items.${index}.quantity`}
						render={({ field }) => (
							<NumberInput.Root
								size="xs"
								disabled={field.disabled}
								name={field.name}
								value={field.value || ""}
								onValueChange={({ value }) => {
									field.onChange(value);
								}}
							>
								<NumberInput.Control />
								<NumberInput.Input onBlur={field.onBlur} />
							</NumberInput.Root>
						)}
					/>
				</Field>
			</Table.Cell>

			<Table.Cell>
				<Field
					required
					invalid={!!errors.items?.[index]?.unit_price}
					errorText={errors.items?.[index]?.unit_price?.message}
				>
					<Controller
						control={control}
						name={`items.${index}.unit_price`}
						render={({ field }) => (
							<NumberInput.Root
								size="xs"
								name={field.name}
								value={String(field.value ?? "")}
								onValueChange={({ value }) => {
									field.onChange(value ?? "0");
								}}
							>
								<NumberInput.Input readOnly onBlur={field.onBlur} />
							</NumberInput.Root>
						)}
					/>
				</Field>
			</Table.Cell>

			<Table.Cell>
				<Text fontSize="sm">{calculateTotal()}</Text>
			</Table.Cell>

			<Table.Cell>
				<IconButton
					size="xs"
					aria-label="Delete item"
					onClick={() => remove(index)}
				>
					<FiTrash />
				</IconButton>
			</Table.Cell>
		</Table.Row>
	);
};

export default EditInvoiceItemRow;
