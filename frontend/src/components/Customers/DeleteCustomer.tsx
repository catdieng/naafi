import { Button, DialogTitle, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { CustomersService } from "@/client";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTrigger,
} from "@/components/ui/dialog";
import useCustomToast from "@/hooks/useCustomToast";

interface DeleteCustomerProps {
	id: number;
	open: boolean;
	onClose: () => void;
}

const DeleteCustomer = ({ id, open, onClose }: DeleteCustomerProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast, showErrorToast } = useCustomToast();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteCustomer = async (id: number) => {
		await CustomersService.deleteCustomer({ id: id });
	};

	const mutation = useMutation({
		mutationFn: deleteCustomer,
		onSuccess: () => {
			showSuccessToast("The expense was deleted successfully");
		},
		onError: () => {
			showErrorToast("An error occurred while deleting the expense");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
		},
	});

	const onSubmit = async () => {
		mutation.mutate(id);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			role="alertdialog"
			open={open}
			onOpenChange={({ open }) => !open && onClose()}
		>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" colorPalette="red">
					<FiTrash2 fontSize="16px" />
					Delete Customer
				</Button>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogCloseTrigger />
					<DialogHeader>
						<DialogTitle>Delete Customer</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>
							This expense will be permanently deleted. Are you sure? You will
							not be able to undo this action.
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

export default DeleteCustomer;
