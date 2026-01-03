import { DialogTitle, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { type BrandCreate, BrandCreateSchema, BrandsService } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Button } from "../ui/button";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";

const AddBrand = () => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<BrandCreate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(BrandCreateSchema),
		defaultValues: {
			name: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: BrandCreate) =>
			BrandsService.createBrand({ requestBody: data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			showSuccessToast("Brand created successfully.");
			setIsOpen(false);
			reset();
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
	});

	const onSubmit: SubmitHandler<BrandCreate> = async (data) => {
		mutation.mutate(data);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={isOpen}
			onOpenChange={({ open }) => {
				reset();
				setIsOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button value="add-item" size="sm">
					<FaPlus fontSize="16px" />
					Add Brand
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogCloseTrigger />
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Add Brand</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text>Fill in the details to add a new brand.</Text>
						<VStack gap={4} mt={4}>
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
			</DialogContent>
		</DialogRoot>
	);
};

export default AddBrand;
