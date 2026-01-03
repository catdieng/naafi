import {
	Button,
	ButtonGroup,
	Combobox,
	createListCollection,
	DialogActionTrigger,
	DialogTitle,
	HStack,
	Input,
	NativeSelect,
	NumberInput,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FaExchangeAlt } from "react-icons/fa";
import {
	type ApiError,
	type ItemPublic,
	ItemsService,
	type ItemUpdate,
	ItemUpdateSchema,
	TaxesService,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";

interface EditItemProps {
	item: ItemPublic;
}

const EditItem = ({ item }: EditItemProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ItemUpdate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(ItemUpdateSchema),
		defaultValues: {
			...item,
			custom_taxes: item.custom_taxes?.map(String),
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["itemCategories"],
		queryFn: ItemsService.readItemCategories,
		enabled: isOpen,
	});

	const { data: taxes } = useQuery({
		queryKey: ["allTaxes"],
		queryFn: TaxesService.readAllTaxes,
		enabled: isOpen,
	});

	const taxList = createListCollection({
		items: taxes?.results
			? taxes.results.map((tax) => ({
					label: `${tax.name} ${tax.rate} ${tax.rate_type === "percentages" ? "%" : ""}`,
					value: String(tax.id),
				}))
			: [],
	});

	const mutation = useMutation({
		mutationFn: (data: ItemUpdate) =>
			ItemsService.updateItem({ id: item.id, requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Item updated successfully.");
			reset();
			setIsOpen(false);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});

	const onSubmit: SubmitHandler<ItemUpdate> = async (data) => {
		mutation.mutate(data);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={isOpen}
			onOpenChange={({ open }) => setIsOpen(open)}
		>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<FaExchangeAlt fontSize="16px" />
					Edit Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Item</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Update the item details below.</Text>
						<VStack gap={4}>
							<Field
								invalid={!!errors.category_id}
								errorText={errors.category_id?.message}
								label="Category"
							>
								<NativeSelect.Root>
									<NativeSelect.Field
										id={useId()}
										{...register("category_id")}
										placeholder="Select category"
									>
										{categories?.results.map((category) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</NativeSelect.Field>
								</NativeSelect.Root>
							</Field>
							<Field
								required
								invalid={!!errors.name}
								errorText={errors.name?.message}
								label="Name"
							>
								<Input
									id={useId()}
									{...register("name", {
										required: "Name is required",
									})}
									placeholder="Name"
									type="text"
								/>
							</Field>

							<HStack width="full">
								<Field
									invalid={!!errors.price}
									errorText={errors.price?.message}
									label="Price"
								>
									<Controller
										name="price"
										control={control}
										render={({ field }) => (
											<NumberInput.Root
												disabled={field.disabled}
												name={field.name}
												value={field.value}
												onValueChange={({ value }) => {
													field.onChange(parseFloat(value));
												}}
											>
												<NumberInput.Control />
												<NumberInput.Input onBlur={field.onBlur} />
											</NumberInput.Root>
										)}
									/>
								</Field>
								<Field
									invalid={!!errors.duration}
									errorText={errors.duration?.message}
									label="Duration"
								>
									<Controller
										name="duration"
										control={control}
										render={({ field }) => (
											<NumberInput.Root
												disabled={field.disabled}
												name={field.name}
												value={field.value}
												onValueChange={({ value }) => {
													field.onChange(parseFloat(value));
												}}
											>
												<NumberInput.Control />
												<NumberInput.Input onBlur={field.onBlur} />
											</NumberInput.Root>
										)}
									/>
								</Field>
							</HStack>

							<Field
								invalid={!!errors.custom_taxes}
								errorText={errors.custom_taxes?.message}
								label="Taxes"
							>
								<Controller
									control={control}
									name="custom_taxes"
									render={({ field }) => (
										<Combobox.Root
											multiple
											closeOnSelect
											collection={taxList}
											name={field.name}
											value={field.value?.map(String) ?? []}
											onValueChange={({ value }) => {
												field.onChange(value.map(String));
											}}
											onInteractOutside={() => field.onBlur()}
										>
											<Combobox.Control>
												<Combobox.Input placeholder={"Select tax or taxes"} />
												<Combobox.IndicatorGroup>
													<Combobox.Trigger />
												</Combobox.IndicatorGroup>
											</Combobox.Control>
											<Combobox.Positioner>
												<Combobox.Content>
													<Combobox.Empty>No taxes found</Combobox.Empty>
													{taxList.items.map((taxList) => (
														<Combobox.Item
															item={taxList}
															key={String(taxList.value)}
														>
															{taxList.label}
															<Combobox.ItemIndicator />
														</Combobox.Item>
													))}
												</Combobox.Content>
											</Combobox.Positioner>
										</Combobox.Root>
									)}
								/>
							</Field>

							<Field
								invalid={!!errors.description}
								errorText={errors.description?.message}
								label="Description"
							>
								<Textarea
									id={useId()}
									{...register("description")}
									placeholder="Description"
								/>
							</Field>
						</VStack>
					</DialogBody>

					<DialogFooter gap={2}>
						<ButtonGroup>
							<DialogActionTrigger asChild>
								<Button variant="subtle" disabled={isSubmitting}>
									Cancel
								</Button>
							</DialogActionTrigger>
							<Button variant="solid" type="submit" loading={isSubmitting}>
								Save
							</Button>
						</ButtonGroup>
					</DialogFooter>
				</form>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
};

export default EditItem;
