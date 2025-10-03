import {
	Combobox,
	IconButton,
	NumberInput,
	Portal,
	Table,
	Text,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import type { InvoiceCreate, ItemOut } from "@/client";
import { Field } from "../ui/field";

interface ItemRowInvoiceProps {
	index: number;
	field: any;
	remove: (index: number) => void;
	services?: { results?: ItemOut[] };
	collection: {
		items: Array<{ label: string; value: string }>;
	};
	onInputChange: (details: any) => void;
	calculateTotal: (quantity: string, unitPrice: string) => string;
}

const ItemRowInvoice = ({
	index,
	field,
	remove,
	services,
	collection,
	onInputChange,
	calculateTotal,
}: ItemRowInvoiceProps) => {
	const {
		control,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<InvoiceCreate>();

	const quantity = watch(`items.${index}.quantity`);
	const unitPrice = watch(`items.${index}.unit_price`);
	const serviceId = watch(`items.${index}.service_id`);
	const total = calculateTotal(quantity, unitPrice);

	// Get the current selected service to display its name
	const selectedService = useMemo(() => {
		if (!serviceId || !services?.results) return null;
		return services.results.find((service) => String(service.id) === serviceId);
	}, [serviceId, services]);

	// Combine collection items with the currently selected service if it's not in the collection
	const enhancedCollection = useMemo(() => {
		const collectionItems = [...collection.items];

		// If we have a selected service that's not in the current collection, add it
		if (
			selectedService &&
			!collectionItems.some((item) => item.value === String(selectedService.id))
		) {
			collectionItems.unshift({
				label: selectedService.name,
				value: String(selectedService.id),
			});
		}

		return { items: collectionItems };
	}, [collection.items, selectedService]);

	const handleServiceChange = useCallback(
		(value: string[]) => {
			const service = services?.results?.find(
				(el) => el.id === Number(value[0]),
			);
			if (service) {
				setValue(`items.${index}.service_id`, String(service.id));
				setValue(`items.${index}.unit_price`, String(service.price) || "0");
			} else {
				// Clear values if service not found or cleared
				setValue(`items.${index}.service_id`, "");
				setValue(`items.${index}.unit_price`, "0");
			}
		},
		[services, setValue, index],
	);

	// Handle clearing the selection
	const handleClearSelection = useCallback(() => {
		setValue(`items.${index}.service_id`, "");
		setValue(`items.${index}.unit_price`, "0");
	}, [setValue, index]);

	return (
		<Table.Row key={field.id}>
			<Table.Cell>
				<Field
					required
					invalid={!!errors.items?.[index]?.service_id}
					errorText={errors.items?.[index]?.service_id?.message}
				>
					<Controller
						name={`items.${index}.service_id`}
						control={control}
						render={({ field: controllerField }) => (
							<Combobox.Root
								size="xs"
								// Always ensure the selected value is in the collection
								collection={enhancedCollection}
								value={
									controllerField.value ? [String(controllerField.value)] : []
								}
								onValueChange={({ value }) => {
									handleServiceChange(value);
									controllerField.onChange(value[0] ?? "");
								}}
								onInputValueChange={onInputChange}
							>
								<Combobox.Label visuallyHidden>Select Service</Combobox.Label>
								<Combobox.Control>
									<Combobox.Input
										placeholder="Search a service"
										// Display the selected service name as the input value
										value={selectedService?.name || ""}
										onChange={() => {}} // Prevent direct input changes
										aria-describedby={
											errors.items?.[index]?.service_id
												? `service-error-${index}`
												: undefined
										}
									/>
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
											{enhancedCollection.items.map((item) => (
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
						name={`items.${index}.quantity`}
						control={control}
						render={({ field: controllerField }) => (
							<NumberInput.Root
								size="xs"
								disabled={controllerField.disabled}
								name={controllerField.name}
								value={controllerField.value || ""}
								onValueChange={({ value }) => {
									controllerField.onChange(value);
								}}
								min={0}
								step={1}
							>
								<NumberInput.Control />
								<NumberInput.Input
									onBlur={controllerField.onBlur}
									aria-describedby={
										errors.items?.[index]?.quantity
											? `quantity-error-${index}`
											: undefined
									}
								/>
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
						name={`items.${index}.unit_price`}
						control={control}
						render={({ field: controllerField }) => (
							<NumberInput.Root
								size="xs"
								disabled={controllerField.disabled}
								name={controllerField.name}
								value={String(controllerField.value) ?? ""}
								onValueChange={({ value }) => {
									controllerField.onChange(value);
								}}
								min={0}
								step={0.01}
							>
								<NumberInput.Control />
								<NumberInput.Input
									onBlur={controllerField.onBlur}
									aria-describedby={
										errors.items?.[index]?.unit_price
											? `price-error-${index}`
											: undefined
									}
								/>
							</NumberInput.Root>
						)}
					/>
				</Field>
			</Table.Cell>
			<Table.Cell>
				<Text fontWeight="medium">${total}</Text>
			</Table.Cell>
			<Table.Cell textAlign="end">
				<IconButton
					size="xs"
					variant="ghost"
					colorPalette="red"
					aria-label="Delete item"
					onClick={() => remove(index)}
				>
					<FiTrash />
				</IconButton>
			</Table.Cell>
		</Table.Row>
	);
};

export default ItemRowInvoice;
