import {
	Button,
	createListCollection,
	DialogActionTrigger,
	DialogTitle,
	Input,
	NativeSelect,
	Select,
	Text,
	VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { HiPlus } from "react-icons/hi";
import {
	CategoriesService,
	type CategoryCreate,
	CategoryCreateSchema,
	TaxesService,
} from "@/client";
import type { ApiError } from "@/client/core/ApiError";
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

const types = createListCollection({
	items: [
		{ label: "Expense", value: "expense" },
		{ label: "Service", value: "service" },
	],
});

const AddCategory = () => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<CategoryCreate>({
		mode: "onChange",
		criteriaMode: "all",
		resolver: zodResolver(CategoryCreateSchema),
		defaultValues: {
			name: "",
			parent: null,
			default_taxes: [],
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["allCategories"],
		queryFn: CategoriesService.readAllCategories,
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
		mutationFn: (data: CategoryCreate) =>
			CategoriesService.createCategory({ requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Category created successfully.");
			reset();
			setIsOpen(false);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const onSubmit: SubmitHandler<CategoryCreate> = (data) => {
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
				<Button value="add-item" size="xs">
					<HiPlus fontSize="16px" />
					Add Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Add Category</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Fill in the details to add a new item.</Text>
						<VStack gap={4}>
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

							<Field
								required
								invalid={!!errors.type}
								errorText={errors.type?.message}
								label="Type"
							>
								<NativeSelect.Root>
									<NativeSelect.Field
										placeholder="Select a category type"
										{...register("type")}
									>
										;
										{types.items.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</Field>

							<Field
								invalid={!!errors.parent}
								errorText={errors.parent?.message}
								label="Parent"
							>
								<NativeSelect.Root>
									<NativeSelect.Field
										placeholder="Select a parent category"
										{...register("parent", {
											setValueAs: (v) => {
												const num = Number(v);
												return Number.isNaN(num) || num === 0 ? undefined : num;
											},
										})}
									>
										{categories?.results.map((category) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</Field>

							<Field
								invalid={!!errors.default_taxes}
								errorText={errors.default_taxes?.message}
								label="Taxes"
							>
								<Controller
									control={control}
									name="default_taxes"
									render={({ field }) => (
										<Select.Root<{ label: string; value: number }>
											multiple
											name={field.name}
											value={field.value}
											onValueChange={({ value }) => {
												field.onChange(value.map(String));
											}}
											onInteractOutside={() => field.onBlur()}
											collection={taxList}
											size="sm"
										>
											<Select.HiddenSelect />
											<Select.Control>
												<Select.Trigger>
													<Select.ValueText placeholder="Select taxes" />
												</Select.Trigger>
												<Select.IndicatorGroup>
													<Select.Indicator />
												</Select.IndicatorGroup>
											</Select.Control>
											<Select.Positioner>
												<Select.Content>
													{taxList.items.map((taxList) => (
														<Select.Item
															item={taxList}
															key={String(taxList.value)}
														>
															{taxList.label}
															<Select.ItemIndicator />
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Select.Root>
									)}
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

export default AddCategory;
