import { Dialog, DialogContent, Portal, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BrandsService } from "@/client";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
} from "@/components/ui/dialog";
import useCustomToast from "@/hooks/useCustomToast";
import { Button } from "../ui/button";

interface DeleteBrandModelProps {
	brandId: number;
	id: number;
	open?: boolean;
	onClose?: () => void;
}

const DeleteBrandModel = ({
	brandId,
	id,
	open,
	onClose,
}: DeleteBrandModelProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast, showErrorToast } = useCustomToast();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteModel = async (id: number) => {
		await BrandsService.deleteModel({ brand_pk: brandId, id });
	};

	const mutation = useMutation({
		mutationFn: deleteModel,
		onSuccess: () => {
			showSuccessToast("The model was deleted successfully");
		},
		onError: () => {
			showErrorToast("An error occured while deleting the model");
		},
		onSettled: () => {
			queryClient.invalidateQueries();
			onClose?.();
		},
	});

	const onSubmit = async () => {
		mutation.mutate(id);
	};

	return (
		<DialogRoot size={{ base: "xs", md: "md" }} placement="center" open={open}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<DialogContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<DialogCloseTrigger />
							<DialogHeader>
								<DialogTitle>Delete Model</DialogTitle>
							</DialogHeader>
							<DialogBody>
								<Text mb={4}>
									This item will be permanently deleted. Are you sure ? You will
									not be able to undo this action.
								</Text>
							</DialogBody>
							<DialogFooter gap={2}>
								<DialogActionTrigger asChild>
									<Button
										variant="outline"
										disabled={isSubmitting}
										onClick={onClose}
									>
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
				</Dialog.Positioner>
			</Portal>
		</DialogRoot>
	);
};

export default DeleteBrandModel;
