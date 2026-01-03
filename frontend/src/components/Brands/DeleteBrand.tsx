import { Button, DialogTitle, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BrandsService } from "@/client";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
} from "@/components/ui/dialog";
import useCustomToast from "@/hooks/useCustomToast";

interface DeleteBrandProps {
	id: number;
	open?: boolean;
	onClose?: () => void;
}

const DeleteBrand = ({ id, open, onClose }: DeleteBrandProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast, showErrorToast } = useCustomToast();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteBrand = async (id: number) => {
		await BrandsService.deleteBrand({ id: id });
	};

	const mutation = useMutation({
		mutationFn: deleteBrand,
		onSuccess: () => {
			showSuccessToast("The brand was deleted successfully");
		},
		onError: () => {
			showErrorToast("An error occurred while deleting the brand");
		},
		onSettled: () => {
			onClose?.();
			queryClient.invalidateQueries();
		},
	});

	const onSubmit = async () => {
		mutation.mutate(id);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={open}
			onOpenChange={({ open }) => !open && onClose?.()}
		>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogCloseTrigger />
					<DialogHeader>
						<DialogTitle>Delete Brand</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>
							This item will be permanently deleted. Are you sure? You will not
							be able to undo this action.
						</Text>
					</DialogBody>

					<DialogFooter gap={2}>
						<DialogActionTrigger asChild>
							<Button variant="subtle" disabled={isSubmitting}>
								Cancel
							</Button>
						</DialogActionTrigger>
						<Button
							variant="solid"
							colorPalette="red"
							type="submit"
							loading={isSubmitting}
						>
							Delete
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</DialogRoot>
	);
};

export default DeleteBrand;
