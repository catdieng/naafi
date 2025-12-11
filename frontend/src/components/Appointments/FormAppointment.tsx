import { Button, HStack, Input, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type AppointmentCreate,
	AppointmentCreateSchema,
	type AppointmentPublic,
	type AppointmentUpdate,
	AppointmentUpdateSchema,
} from "@/client";
import { SelectCustomer } from "../Common/SelectCustomer";
import { SelectService } from "../Common/SelectService";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Field } from "../ui/field";

interface FormAppointmentProps {
	defaultValues?: Partial<AppointmentPublic | null>;
	onSubmit: SubmitHandler<AppointmentCreate | AppointmentUpdate>;
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
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<AppointmentCreate | AppointmentUpdate>({
		mode: "all",
		criteriaMode: "all",
		resolver: zodResolver(
			defaultValues ? AppointmentUpdateSchema : AppointmentCreateSchema,
		),
		defaultValues: {
			...defaultValues,
			customer_id: defaultValues?.customer_id
				? String(defaultValues.customer_id)
				: null,
			start: defaultValues?.start,
			end: defaultValues?.end,
			services_ids: defaultValues?.services?.map((e) => String(e.id)) ?? [],
		},
	});

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
					name="customer_id"
					control={control}
					label="Customer"
					customer={defaultValues?.customer}
					placeholder="Search and select customer"
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
