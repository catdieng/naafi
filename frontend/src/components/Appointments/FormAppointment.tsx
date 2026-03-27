import { HStack, Input, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	AppointmentFormSchema,
	type AppointmentFormValues,
	type AppointmentPublic,
} from "@/client";
import { SelectCustomer } from "../Common/SelectCustomer";
import { SelectService } from "../Common/SelectService";
import SelectVehicle from "../Common/SelectVehicle";
import { Button } from "../ui/button";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Field } from "../ui/field";

interface FormAppointmentProps {
	defaultValues?: Partial<AppointmentPublic | null>;
	onSubmit: SubmitHandler<AppointmentFormValues>;
	onCancel: () => void;
	submitLabel?: string;
	isSubmitting?: boolean;
}

export const FormAppointment = ({
	defaultValues,
	onSubmit,
	onCancel,
	submitLabel = "Save",
	isSubmitting = false,
}: FormAppointmentProps) => {
	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		register,
		reset,
		watch,
	} = useForm<AppointmentFormValues>({
		mode: "all",
		criteriaMode: "all",
		resolver: zodResolver(AppointmentFormSchema),
		defaultValues: {
			start: "",
			end: "",
			customer_id: undefined,
			vehicle: undefined,
			services_ids: [],
			description: "",
		},
	});

	const watchedCustomerId = watch("customer_id");

	const onClearCustomer = () => {
		reset({ vehicle: null });
	};

	useEffect(() => {
		if (!defaultValues) return;

		// check if defaultValues.vehicle is an object
		const vehicle = defaultValues?.vehicle
			? {
					label: `${defaultValues?.vehicle?.brand_name} ${defaultValues?.vehicle?.model_name} ${defaultValues?.vehicle?.license_plate}`,
					value: defaultValues?.vehicle?.id,
				}
			: null;
		reset({
			start: defaultValues?.start,
			end: defaultValues?.end,
			customer_id: defaultValues.customer_id,
			vehicle: vehicle,
			services_ids: defaultValues.services?.map((e) => String(e.id)) ?? [],
		});
	}, [defaultValues, reset]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogBody>
				<HStack gap={4} width="100%">
					<Field
						required
						invalid={!!errors.start}
						errorText={errors.start?.message}
						label="Start Time"
					>
						<Input type="datetime-local" {...register("start")} />
					</Field>
					<Field
						required
						invalid={!!errors.end}
						errorText={errors.end?.message}
						label="End Time"
					>
						<Input type="datetime-local" {...register("end")} />
					</Field>
				</HStack>
				<SelectCustomer
					required
					name="customer_id"
					control={control}
					label="Customer"
					customer={defaultValues?.customer}
					placeholder="Search and select customer"
					onClear={onClearCustomer}
				/>
				<SelectVehicle
					disabled={!watchedCustomerId}
					customerId={watchedCustomerId!}
					name="vehicle"
					control={control}
					label="Vehicle"
					vehicle={defaultValues?.vehicle}
					placeholder="Search and select vehicle"
				/>
				<SelectService
					name="services_ids"
					control={control}
					label="Services"
					placeholder="Select services"
				/>
				<Field
					py={4}
					label="Description"
					invalid={!!errors.description}
					errorText={errors.description?.message}
				>
					<Textarea size="xl" {...register("description")} />
				</Field>
			</DialogBody>
			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					variant="solid"
					type="submit"
					disabled={!isValid}
					loading={isSubmitting}
				>
					{submitLabel}
				</Button>
			</DialogFooter>
		</form>
	);
};
