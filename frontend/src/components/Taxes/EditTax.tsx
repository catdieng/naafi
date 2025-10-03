import {
	Button,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FiEdit3 } from "react-icons/fi";
import {
	TaxesService,
	type TaxPublic,
	type TaxUpdate,
	TaxUpdateSchema,
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

interface EditTaxProps {
	tax: TaxPublic;
}

const EditTax = ({ tax }: EditTaxProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<TaxUpdate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(TaxUpdateSchema),
		defaultValues: {
			...tax,
			description: tax.description ?? undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: TaxUpdate) =>
			TaxesService.updateTax({ id: tax.id, requestBody: data }),
		onSuccess: () => {
			showSuccessToast("Tax updated successfully.");
			reset();
			setIsOpen(false);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["taxes"] });
		},
	});

	const onSubmit: SubmitHandler<TaxUpdate> = (data) => {
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
				<Button value="edit-tax" variant="ghost">
					<FiEdit3 fontSize="16px" />
					Edit Tax
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Add Tax</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Fill in the details to add a new tax.</Text>
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

							<HStack gap="10" width="full">
								<Field
									invalid={!!errors.rate}
									errorText={errors.rate?.message}
									label="Rate"
								>
									<Controller
										name="rate"
										control={control}
										render={({ field }) => (
											<NumberInput.Root
												disabled={field.disabled}
												name={field.name}
												value={field.value?.toString()}
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
									invalid={!!errors.rate_type}
									errorText={errors.rate_type?.message}
									label="Type"
								>
									<NativeSelect.Root size="sm" width="240px">
										<NativeSelect.Field
											placeholder="Select option"
											{...register("rate_type")}
										>
											<option value="percentages">Percentages</option>
											<option value="fixed">Fixed</option>
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</Field>
							</HStack>

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

export default EditTax;
