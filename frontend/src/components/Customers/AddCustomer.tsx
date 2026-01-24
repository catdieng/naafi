import { Input, Link, Text, Textarea, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import {
	type CustomerCreate,
	CustomerCreateSchema,
	type CustomerPublic,
	CustomersService,
} from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError, telPattern } from "@/utils";
import { Button } from "../ui/button";
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

type AddCustomerProps = {
	appearance?: "link" | "button";
	onCustomerCreated?: (customer: CustomerPublic) => void;
};

const AddCustomer = ({
	appearance = "button",
	onCustomerCreated,
}: AddCustomerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<CustomerCreate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(CustomerCreateSchema),
		defaultValues: {
			full_name: "",
			email: "",
			address: "",
			phone: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: CustomerCreate) =>
			CustomersService.createCustomer({ requestBody: data }),
		onSuccess: (data) => {
			showSuccessToast("Customer created successfully.");
			reset();
			setIsOpen(false);
			onCustomerCreated?.(data);
		},
		onError: (err: ApiError) => {
			handleError(err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
		},
	});

	const onSubmit: SubmitHandler<CustomerCreate> = (data) => {
		mutation.mutate(data);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={isOpen}
			onOpenChange={({ open }) => setIsOpen(open)}
			onRequestDismiss={() => {
				reset();
			}}
		>
			<DialogTrigger asChild>
				{appearance === "button" ? (
					<Button value="add-customer" size="xs">
						<FaPlus fontSize="16px" />
						Add Customer
					</Button>
				) : (
					<Link href="#">
						<FaPlus fontSize="16px" />
						Add Customer
					</Link>
				)}
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Add Customer</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Fill in the details to add a new customer.</Text>
						<VStack gap={4}>
							<Field
								required
								invalid={!!errors.full_name}
								errorText={errors.full_name?.message}
								label="Name"
							>
								<Input
									id={useId()}
									{...register("full_name", {
										required: "Full name is required.",
									})}
									placeholder="Full name"
									type="text"
								/>
							</Field>
							<Field
								required
								invalid={!!errors.email}
								errorText={errors.email?.message}
								label="Email"
							>
								<Input
									id={useId()}
									{...register("email", {
										required: "Email is required",
										pattern: emailPattern,
									})}
									placeholder="Email"
									type="email"
								/>
							</Field>

							<Field
								required
								invalid={!!errors.phone}
								errorText={errors.phone?.message}
								label="Phone"
							>
								<Input
									id={useId()}
									{...register("phone", {
										required: "Phone number is required",
										pattern: telPattern,
									})}
									placeholder="Phone number"
									type="tel"
								/>
							</Field>

							<Field
								invalid={!!errors.address}
								errorText={errors.address?.message}
								label="Address"
							>
								<Textarea
									id={useId()}
									{...register("address")}
									placeholder="Street address, city, postal code"
								></Textarea>
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

export default AddCustomer;
