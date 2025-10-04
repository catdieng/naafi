import { Button, DialogTitle, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { AppointmentsService } from "@/client";
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

const DeleteAppointment = ({
	id,
	onDelete,
}: {
	id: number;
	onDelete?: () => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast, showErrorToast } = useCustomToast();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteAppointment = async (id: number) => {
		await AppointmentsService.deleteAppointment({ id: id });
	};

	const mutation = useMutation({
		mutationFn: deleteAppointment,
		onSuccess: () => {
			showSuccessToast("The appointment was deleted successfully");
			setIsOpen(false);
			onDelete?.();
		},
		onError: () => {
			showErrorToast("An error occurred while deleting the appointment");
		},
		onSettled: () => {
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
			role="alertdialog"
			open={isOpen}
			onOpenChange={({ open }) => setIsOpen(open)}
		>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" colorPalette="red">
					<FiTrash2 fontSize="16px" />
					Delete
				</Button>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogCloseTrigger />
					<DialogHeader>
						<DialogTitle>Delete Appointment</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>
							This appointment will be permanently deleted. Are you sure? You
							will not be able to undo this action.
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

export default DeleteAppointment;
