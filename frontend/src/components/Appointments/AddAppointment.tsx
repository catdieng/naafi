import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import {
	type ApiError,
	type AppointmentCreate,
	AppointmentCreateSchema,
	type AppointmentFormValues,
	AppointmentsService,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Button } from "../ui/button";
import {
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { FormAppointment } from "./FormAppointment";
import { useAppointmentContext } from "./ProviderAppointment";

const AddAppointment = () => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const { selectedSlot, setSelectedSlot } = useAppointmentContext();

	const {
		reset,
		formState: { isSubmitting },
	} = useForm<AppointmentCreate>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(AppointmentCreateSchema),
	});

	const mutation = useMutation({
		mutationFn: (data: AppointmentCreate) =>
			AppointmentsService.createAppointment({ requestBody: data }),
		onSuccess: () => {
			setIsOpen(false);
			showSuccessToast("Appointment created successfully.");
			reset();
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
			setIsOpen(false);
			setSelectedSlot(null);
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
	});

	const onSubmit: SubmitHandler<AppointmentFormValues> = (data) => {
		mutation.mutate({
			...(data as AppointmentCreate),
			vehicle_id: data.vehicle?.value,
		});
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={isOpen || !!selectedSlot}
			onOpenChange={({ open }) => {
				setIsOpen(open);
				if (!open) setSelectedSlot(null);
			}}
		>
			<DialogTrigger asChild>
				<Button value="add-appointment" size="sm">
					<FaPlus fontSize="16px" />
					Add Appointment
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Appointment</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<FormAppointment
					defaultValues={
						selectedSlot
							? {
									start: dayjs(selectedSlot.start).format("YYYY-MM-DDTHH:mm"),
									end: dayjs(selectedSlot.end).format("YYYY-MM-DDTHH:mm"),
								}
							: {}
					}
					onSubmit={onSubmit}
					onCancel={() => {
						setIsOpen(false);
						setSelectedSlot(null);
					}}
					isSubmitting={isSubmitting}
					submitLabel="Save"
				/>
			</DialogContent>
		</DialogRoot>
	);
};

export default AddAppointment;
