import {
	Combobox,
	IconButton,
	NumberInput,
	Table,
	Text,
	useListCollection,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiPlusCircle, FiTrash } from "react-icons/fi";
import { type InvoiceCreate, ItemsService } from "@/client";
import { Button } from "../ui/button";
import { Field } from "../ui/field";

const EditInvoiceItem = () => {
	const {
		control,
		formState: { errors },
		setValue,
		watch,
	} = useFormContext<InvoiceCreate>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const { collection, set } = useListCollection<{
		label: string;
		value: string;
	}>({
		initialItems: [],
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
	});

	const { data: services, isLoading: itemsLoading } = useQuery({
		queryKey: ["itemsAll"],
		queryFn: ItemsService.readItemsAll,
	});

	const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
		let filteredItems: {
			label: string;
			value: string;
		}[] = [];
		if (details.inputValue.length) {
			filteredItems =
				services?.results
					?.filter((item) => {
						return item.name
							.toLowerCase()
							.includes(details.inputValue.toLowerCase());
					})
					.map((el) => ({ label: el.name, value: String(el.id) })) || [];
		} else {
			filteredItems =
				services?.results?.map((el) => ({
					label: el.name,
					value: String(el.id),
				})) || [];
		}

		set(filteredItems);
	};

	const calculateTotal = (quantity: string, unitPrice: string) => {
		const qty = parseFloat(quantity || "0");
		const price = parseFloat(unitPrice || "0");
		return (qty * price).toFixed(2);
	};

	useEffect(() => {
		if (services) {
			set(
				services?.results.map((el) => ({
					label: el.name,
					value: String(el.id),
				})),
			);
		}
	}, [services]);

	return (
		<>
			<Table.Root size="sm" variant="outline" my={4} rounded="md">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Service</Table.ColumnHeader>
						<Table.ColumnHeader>Quantity</Table.ColumnHeader>
						<Table.ColumnHeader>Unit Price</Table.ColumnHeader>
						<Table.ColumnHeader>Sub Total</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{fields.map((field, index) => {
						const quantity = watch(`items.${index}.quantity`);
						const unitPrice = watch(`items.${index}.unit_price`);
						const total = calculateTotal(quantity, unitPrice);
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
											render={({ field }) => (
												<>
													<Combobox.Root
														size="xs"
														defaultValue={
															field.value ? [String(field.value)] : []
														}
														collection={collection}
														value={field.value ? [String(field.value)] : []}
														onValueChange={({ value }) => {
															const service = services?.results?.find(
																(el) => el.id === Number(value[0]),
															);
															if (service) {
																setValue(
																	`items.${index}.service_id`,
																	service?.id,
																);
																setValue(
																	`items.${index}.unit_price`,
																	String(service?.price) || "0",
																);
															}
															field.onChange(value[0] ?? "");
														}}
														onInputValueChange={handleInputChange}
													>
														<Combobox.Control>
															<Combobox.Input placeholder="Search a service" />
															<Combobox.IndicatorGroup>
																<Combobox.ClearTrigger />
																<Combobox.Trigger />
															</Combobox.IndicatorGroup>
														</Combobox.Control>
														<Combobox.Positioner>
															<Combobox.Content>
																<Combobox.Empty>
																	No Services found
																</Combobox.Empty>
																{collection.items.map((item) => (
																	<Combobox.Item key={item.value} item={item}>
																		{item.label}
																		<Combobox.ItemIndicator />
																	</Combobox.Item>
																))}
															</Combobox.Content>
														</Combobox.Positioner>
													</Combobox.Root>
													{/* <Select<OptionType>
														size="sm"
														{...field}
														value={options.find(
															(el) => el.value === Number(field.value),
														)}
														onChange={(val) => {
															const service = services?.results?.find(
																(el) => el.id === Number(val?.value),
															);
															if (service) {
																setValue(
																	`items.${index}.service_id`,
																	service?.id,
																);
																setValue(
																	`items.${index}.unit_price`,
																	String(service?.price) || "0",
																);
															}
															field.onChange(val?.value);
														}}
														isSearchable
														options={options}
														menuPlacement="auto"
														menuPosition="fixed"
														menuShouldScrollIntoView={false}
														isLoading={itemsLoading}
													/> */}
												</>
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
											render={({ field }) => (
												<NumberInput.Root
													size="xs"
													disabled={field.disabled}
													name={field.name}
													value={field.value || ""}
													onValueChange={({ value }) => {
														console.log(typeof value);
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
											name={`items.${index}.unit_price`}
											control={control}
											render={({ field }) => (
												<NumberInput.Root
													size="xs"
													disabled={field.disabled}
													name={field.name}
													value={String(field.value) ?? ""}
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
									<Text>${total}</Text>
								</Table.Cell>
								<Table.Cell textAlign="end">
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
					})}
				</Table.Body>
			</Table.Root>
			<br />
			<Button
				variant="plain"
				onClick={() => {
					append({ service_id: 0, quantity: "1", unit_price: "0" });
				}}
			>
				<FiPlusCircle /> Add Row
			</Button>
		</>
	);
};

export default EditInvoiceItem;
