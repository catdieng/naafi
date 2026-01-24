import {
	Badge,
	Combobox,
	createListCollection,
	HStack,
	Input,
	Link,
	NativeSelect,
	NumberInput,
	Text,
	Textarea,
	VStack,
	Wrap,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import {
	type ItemCreate,
	ItemCreateSchema,
	type ItemPublic,
	ItemsService,
	TaxesService,
} from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Button } from "../ui/button";
import { CloseButton } from "../ui/close-button";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";

type AddItemProps = {
	appearance?: "link" | "button";
	onItemCreated?: (customer: ItemPublic) => void;
};

const AddItem = ({ appearance = "button", onItemCreated }: AddItemProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<ItemCreate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(ItemCreateSchema),
		defaultValues: {
			name: "",
			description: "",
			price: "0",
			duration: "0",
			custom_taxes: [],
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
					value: tax.id,
				}))
			: [],
	});

	const mutation = useMutation({
		mutationFn: (data: ItemCreate) =>
			ItemsService.createItem({ requestBody: data }),
		onSuccess: (data) => {
			showSuccessToast("Item created successfully.");
			reset();
			setIsOpen(false);
			onItemCreated?.(data);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});

	const onSubmit: SubmitHandler<ItemCreate> = (data) => {
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
				{appearance === "button" ? (
					<Button value="add-item" size="xs">
						<FaPlus fontSize="16px" />
						Add Item
					</Button>
				) : (
					<Link href="#">
						<FaPlus fontSize="16px" />
						Add Item
					</Link>
				)}
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSubmit(onSubmit)(e);
					}}
				>
					<DialogHeader>
						<DialogTitle>Add Item</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Fill in the details to add a new item.</Text>
						<VStack gap={4}>
							<Field
								invalid={!!errors.category_id}
								errorText={errors.category_id?.message}
								label="Category"
							>
								<NativeSelect.Root>
									<NativeSelect.Field
										id={useId()}
										{...register("category_id", {
											setValueAs: (v) => (v === "" ? undefined : Number(v)),
										})}
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
										required: "Name is required.",
									})}
									placeholder="Name"
									type="text"
								/>
							</Field>

							<HStack gap="10" width="full">
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
													field.onChange(String(parseFloat(value ?? "0")));
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
													const num = parseFloat(value);
													field.onChange(Number.isNaN(num) ? "0" : String(num));
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
										<>
											<Wrap gap="2">
												{(Array.isArray(field.value) ? field.value : []).map(
													(id: string) => {
														const tax = taxes?.results.find(
															(el) => String(el.id) === String(id),
														);
														return tax ? (
															<Badge key={id}>
																{tax.name}
																<CloseButton
																	size="2xs"
																	onClick={() =>
																		field.onChange(
																			(Array.isArray(field.value)
																				? field.value
																				: []
																			).filter((item) => item !== id),
																		)
																	}
																/>
															</Badge>
														) : null;
													},
												)}
											</Wrap>
											<Combobox.Root
												multiple
												closeOnSelect
												collection={taxList}
												value={field.value ?? []}
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
										</>
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
						<DialogActionTrigger asChild>
							<Button variant="subtle" disabled={isSubmitting}>
								Cancel
							</Button>
						</DialogActionTrigger>
						<Button
							variant="solid"
							type="submit"
							disabled={!isValid}
							loading={isSubmitting}
						>
							Save
						</Button>
					</DialogFooter>
				</form>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
};

export default AddItem;
