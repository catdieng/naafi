import { Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CustomersService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
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
} from "../ui/dialog";

interface DeleteVehiculeProps {
	id: number;
	customerId: number;
	onClose?: () => void;
	open: boolean;
}

const DeleteVehicule = ({
	customerId,
	id,
	onClose,
	open,
}: DeleteVehiculeProps) => {
	const queryClient = useQueryClient();
	const { showErrorToast, showSuccessToast } = useCustomToast();

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteVehicle = async (id: number) => {
		await CustomersService.deleteVehicle({ customer_pk: customerId, id: id });
	};

	const mutation = useMutation({
		mutationFn: deleteVehicle,
		onSuccess: () => {
			showSuccessToast("The vehicule was deleted successfully");
			onClose?.();
		},
		onError: () => {
			showErrorToast("An error occurred while deleting the vehicule.");
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
			onRequestDismiss={() => {
				onClose?.();
			}}
		>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogCloseTrigger />
					<DialogHeader>
						<DialogTitle>Delete Vehicule</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>
							This item will be permanently deleted. Are you sure? you will not
							be to undo this action.
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

export default DeleteVehicule;
