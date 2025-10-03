import {
	Button,
	Checkbox,
	DialogActionTrigger,
	DialogTitle,
	FieldRoot,
	HStack,
	Input,
	NativeSelect,
	NumberInput,
	Tabs,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FiEdit3 } from "react-icons/fi";
import {
	type ApiError,
	currencyChoices,
	type ExpensePublic,
	ExpensesService,
	type ExpenseUpdate,
	ExpenseUpdateSchema,
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

const paymentMethods = [
	{ label: "Cash", value: "cash" },
	{ label: "Bank Transfer", value: "bank_transfer" },
	{ label: "Credit Card", value: "credit_card" },
	{ label: "Mobile Money", value: "mobile_money" },
	{ label: "PayPal", value: "paypal" },
	{ label: "Check", value: "check" },
	{ label: "Internal Transfer", value: "internal" },
	{ label: "Cryptocurrency", value: "crypto" },
	{ label: "Other", value: "other" },
];

interface EditExpenseProps {
	expense: ExpensePublic;
}

const EditExpense = ({ expense }: EditExpenseProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
		watch,
	} = useForm<ExpenseUpdate>({
		mode: "onChange",
		criteriaMode: "all",
		resolver: zodResolver(ExpenseUpdateSchema),
		defaultValues: {
			...expense,
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["expenseCategories"],
		queryFn: ExpensesService.readExpenseCategories,
		enabled: isOpen,
	});

	const mutation = useMutation({
		mutationFn: (data: ExpenseUpdate) =>
			ExpensesService.updateExpense({ id: expense.id, requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Expense updated successfully.");
			reset();
			setIsOpen(false);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
		},
	});

	const onSubmit: SubmitHandler<ExpenseUpdate> = (data) => {
		mutation.mutate(data);
	};

	const isPaid = watch("paid");

	const paymentMethod = useId();
	const paymentDate = useId();

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
					Edit Expense
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Expense</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Tabs.Root defaultValue="expense">
							<Tabs.List>
								<Tabs.Trigger value="expense">Expense</Tabs.Trigger>
								<Tabs.Trigger value="expense_detail">More details</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="expense">
								<Text mb={4}>Fill in the details to add a new expense.</Text>
								<VStack gap={4}>
									<HStack width="full" gap={4}>
										{/* Category Field */}
										<Field
											invalid={!!errors.category_id}
											errorText={errors.category_id?.message}
											label="Category"
										>
											<NativeSelect.Root>
												<NativeSelect.Field
													id={useId()}
													{...register("category_id", { valueAsNumber: true })}
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
									</HStack>
									{/* Name Field */}
									<Field
										required
										invalid={!!errors.name}
										errorText={errors.name?.message}
										label="Name"
									>
										<Input
											id={useId()}
											{...register("name")}
											placeholder="Expense name"
										/>
									</Field>
									<HStack gap={2} width="full">
										{/* Amount Field */}
										<Field
											required
											invalid={!!errors.amount}
											errorText={errors.amount?.message}
											label="Amount"
										>
											<Controller
												name="amount"
												control={control}
												render={({ field }) => (
													<NumberInput.Root
														value={field.value?.toString()}
														onChange={(value) => field.onChange(value)}
													>
														<NumberInput.Control />
														<NumberInput.Input
															ref={field.ref}
															onBlur={field.onBlur}
														/>
													</NumberInput.Root>
												)}
											/>
										</Field>

										{/* Currency Field */}
										<Field
											required
											invalid={!!errors.currency}
											errorText={errors.currency?.message}
											label="Currency"
										>
											<NativeSelect.Root>
												<NativeSelect.Field
													id={useId()}
													{...register("currency")}
													placeholder="Select currency"
												>
													{currencyChoices.map((currency) => (
														<option key={currency} value={currency}>
															{currency}
														</option>
													))}
												</NativeSelect.Field>
											</NativeSelect.Root>
										</Field>
									</HStack>

									<HStack width="full">
										{/* Expense Date Field */}
										<Field
											required
											invalid={!!errors.date}
											errorText={errors.date?.message}
											label="Expense Date"
										>
											<Input id={useId()} type="date" {...register("date")} />
										</Field>
										{/* Due Date Field */}
										<Field
											invalid={!!errors.due_date}
											errorText={errors.due_date?.message}
											label="Due Date"
										>
											<Input
												id={useId()}
												type="date"
												{...register("due_date")}
											/>
										</Field>
									</HStack>
									{/* Description Field */}
									<Field
										invalid={!!errors.description}
										errorText={errors.description?.message}
										label="Description"
									>
										<Textarea
											rows={4}
											id={useId()}
											{...register("description")}
											placeholder="Optional description"
										/>
									</Field>
								</VStack>
							</Tabs.Content>
							<Tabs.Content value="expense_detail">
								<VStack gap={4}>
									{/* Supplier */}
									<Field
										invalid={!!errors.supplier}
										errorText={errors.supplier?.message}
										label="Supplier"
									>
										<Input
											id={useId()}
											{...register("supplier")}
											placeholder="Supplier name"
										/>
									</Field>

									{/* Reference */}
									<Field
										invalid={!!errors.reference}
										errorText={errors.reference?.message}
										label="Reference"
									>
										<Input
											id={useId()}
											{...register("reference")}
											placeholder="Refence, Trx Number"
										/>
									</Field>

									{/* Paid Checkbox */}
									<Field
										m={2}
										direction="row"
										alignItems="center"
										invalid={!!errors.paid}
										errorText={!!errors.paid?.message}
									>
										<Controller
											control={control}
											name="paid"
											render={({ field }) => (
												<FieldRoot disabled={field.disabled}>
													<Checkbox.Root
														checked={field.value}
														onCheckedChange={({ checked }) =>
															field.onChange(checked)
														}
													>
														<Checkbox.HiddenInput />
														<Checkbox.Control />
														<Checkbox.Label>Mark as paid</Checkbox.Label>
													</Checkbox.Root>
												</FieldRoot>
											)}
										/>
									</Field>

									{isPaid && (
										<HStack width="full">
											{/* Date Field */}
											<Field
												invalid={!!errors.date}
												errorText={errors.date?.message}
												label="Payment date"
											>
												<Input
													id={paymentDate}
													type="date"
													{...register("payment_date")}
												/>
											</Field>

											{/* Payment method Field */}
											<Field
												invalid={!!errors.payment_method}
												errorText={errors.payment_method?.message}
												label="Payment method"
											>
												<NativeSelect.Root>
													<NativeSelect.Field
														id={paymentMethod}
														{...register("payment_method")}
														placeholder="Select a payment method"
													>
														{paymentMethods?.map((paymentMethod) => (
															<option
																key={paymentMethod.value}
																value={paymentMethod.value}
															>
																{paymentMethod.label}
															</option>
														))}
													</NativeSelect.Field>
												</NativeSelect.Root>
											</Field>
										</HStack>
									)}
								</VStack>
							</Tabs.Content>
						</Tabs.Root>
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
							Save Expense
						</Button>
					</DialogFooter>
				</form>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
};

export default EditExpense;
