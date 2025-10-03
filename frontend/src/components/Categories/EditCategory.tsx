import {
	Button,
	ButtonGroup,
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
import { FiEdit3 } from "react-icons/fi";
import {
	type ApiError,
	CategoriesService,
	type CategoryPublic,
	type CategoryUpdate,
	CategoryUpdateSchema,
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

interface EditCategoryProps {
	category: CategoryPublic;
}

const EditCategory = ({ category }: EditCategoryProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CategoryUpdate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(CategoryUpdateSchema),
		defaultValues: {
			...category,
			default_taxes: category.default_taxes?.map(String),
		},
	});

	const { data: categories, isSuccess } = useQuery({
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
					value: String(tax.id),
				}))
			: [],
	});

	const types = createListCollection({
		items: [
			{ label: "Expense", value: "expense" },
			{ label: "Service", value: "service" },
		],
	});

	const mutation = useMutation({
		mutationFn: (data: CategoryUpdate) =>
			CategoriesService.updateCategory({ id: category.id, requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Category updated successfully.");
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

	const onSubmit: SubmitHandler<CategoryUpdate> = async (data) => {
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
					<FiEdit3 fontSize="16px" />
					Edit Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Category</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Update the category details below.</Text>
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
										required: "Name is required",
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
										{types.items.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</Field>

							{isSuccess && (
								<Field
									invalid={!!errors.parent}
									errorText={errors.parent?.message}
									label="Parent"
								>
									<NativeSelect.Root>
										<NativeSelect.Field
											placeholder="Select a parent category"
											// {...register("parent", {
											//   setValueAs: (v) => v === "" ? undefined : Number(v),
											// })}
											{...register("parent")}
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
							)}

							<Field
								invalid={!!errors.default_taxes}
								errorText={errors.default_taxes?.message}
								label="Taxes"
							>
								<Controller
									control={control}
									name="default_taxes"
									render={({ field }) => (
										<Select.Root
											multiple
											name={field.name}
											value={field.value}
											onValueChange={({ value }) => field.onChange(value)}
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
														<Select.Item item={taxList} key={taxList.value}>
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

export default EditCategory;
