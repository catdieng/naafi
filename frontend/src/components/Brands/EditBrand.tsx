import { Button, DialogTitle, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type BrandPublic,
	BrandsService,
	type BrandUpdate,
	BrandUpdateSchema,
} from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
} from "../ui/dialog";
import { Field } from "../ui/field";

interface EditBrandProps {
	brand: BrandPublic;
	open: boolean;
	onClose: () => void;
}

const EditBrand = ({ brand, open, onClose }: EditBrandProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<BrandUpdate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(BrandUpdateSchema),
		defaultValues: brand,
	});

	const mutation = useMutation({
		mutationFn: (data: BrandUpdate) =>
			BrandsService.updateBrand({ id: brand.id, requestBody: data }),
		onSuccess: () => {
			onClose();
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			showSuccessToast("Brand updated successfully.");
			reset();
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
	});

	const onSubmit: SubmitHandler<BrandUpdate> = async (data) => {
		mutation.mutate(data);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={open}
			onOpenChange={({ open }) => !open && onClose()}
		>
			<DialogContent>
				<DialogCloseTrigger />
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Brand</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>Update the brand details below.</Text>
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
						</VStack>
					</DialogBody>
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant="subtle" disabled={isSubmitting}>
								Cancel
							</Button>
						</DialogActionTrigger>

						<Button
							type="submit"
							disabled={!isValid || isSubmitting}
							loading={isSubmitting}
						>
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</DialogRoot>
	);
};
export default EditBrand;
