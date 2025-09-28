import { DialogTitle } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type ApiError,
	type AppointmentPublic,
	AppointmentsService,
	type AppointmentUpdate,
	AppointmentUpdateSchema,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import {
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
} from "../ui/dialog";

import { FormAppointment } from "./FormAppointment";
import { useAppointmentContext } from "./ProviderAppointment";

const EditAppointment = () => {
	const [, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const { selectedAppointment, setSelectedAppointment } =
		useAppointmentContext();

	const {
		reset,
		formState: { isSubmitting },
	} = useForm<AppointmentUpdate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(AppointmentUpdateSchema),
		defaultValues: {
			description: "",
			services: [],
		},
	});

	const mapAppointmentToForm = (
		appointment: AppointmentPublic,
	): Partial<AppointmentUpdate> => {
		return {
			start: appointment.start,
			end: appointment.end,
			description: appointment.description ?? "",
			customer_id: appointment.customer_id,
			customer: appointment.customer,
			services: appointment.services_ids?.map((id) => id.toString()) ?? [],
		};
	};

	const mutation = useMutation({
		mutationFn: (data: AppointmentUpdate) => {
			if (!selectedAppointment) {
				return Promise.reject("No appointment selected");
			}

			return AppointmentsService.updateAppointment({
				id: selectedAppointment?.id,
				requestBody: data,
			});
		},
		onSuccess: () => {
			showSuccessToast("Appointment updated successfully.");
			reset();
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
			setIsOpen(false);
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
	});

	const onSubmit: SubmitHandler<AppointmentUpdate> = (data) => {
		mutation.mutate(data);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={!!selectedAppointment}
			onOpenChange={({ open }) => {
				if (!open) setSelectedAppointment(null);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Appointment</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<FormAppointment
					defaultValues={
						selectedAppointment ? mapAppointmentToForm(selectedAppointment) : {}
					}
					onSubmit={onSubmit}
					onCancel={() => {
						setIsOpen(false);
						setSelectedAppointment(null);
					}}
					isSubmitting={isSubmitting}
					submitLabel="Save"
				/>
			</DialogContent>
		</DialogRoot>
	);
};

export default EditAppointment;
