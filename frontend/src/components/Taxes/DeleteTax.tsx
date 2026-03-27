import { DialogTitle, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { TaxesService } from "@/client";
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
import { Button } from "../ui/button";

const DeleteTax = ({ id }: { id: number }) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast, showErrorToast } = useCustomToast();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const deleteTax = async (id: number) => {
		await TaxesService.deleteTax({ id: id });
	};

	const mutation = useMutation({
		mutationFn: deleteTax,
		onSuccess: () => {
			showSuccessToast("The tax was deleted successfully");
			setIsOpen(false);
		},
		onError: () => {
			showErrorToast("An error occurred while deleting the tax");
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
					Delete Item
				</Button>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogCloseTrigger />
					<DialogHeader>
						<DialogTitle>Delete Item</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={4}>
							This tax will be permanently deleted. Are you sure? You will not
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

export default DeleteTax;
