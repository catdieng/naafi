import { DialogTitle, Input, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type ApiError,
	CustomersService,
	type VehicleForm,
	VehicleFormSchema,
	type VehiclePublic,
	type VehicleUpdate,
} from "@/client";
import SelectBrand from "@/components/Common/SelectBrand";
import SelectBrandModel from "@/components/Common/SelectBrandModel";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Button } from "../ui/button";
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
} from "../ui/dialog";
import { Field } from "../ui/field";

interface EditVehicleProps {
	customerId: number;
	open: boolean;
	onClose?: () => void;
	vehicle: VehiclePublic;
}

const EditVehicle = ({
	customerId,
	open,
	onClose,
	vehicle,
}: EditVehicleProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const {
		control,
		formState: { errors, isValid, isSubmitting },
		handleSubmit,
		register,
		reset,
		watch,
	} = useForm<VehicleForm>({
		mode: "all",
		criteriaMode: "all",
		resolver: zodResolver(VehicleFormSchema),
		defaultValues: {
			...vehicle,
			brand: {
				label: vehicle.brand_name,
				value: vehicle.brand,
			},
			model: {
				label: vehicle.model_name,
				value: vehicle.model,
			},
		},
	});

	const watchedBrand = watch("brand");

	const mutation = useMutation({
		mutationFn: (data: VehicleUpdate) =>
			CustomersService.updateVehicle({
				id: vehicle.id,
				customer_pk: customerId,
				requestBody: data,
			}),
		onSuccess: () => {
			showSuccessToast("Vehicle updated successfully");
			reset();
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
		onSettled: () => {
			onClose?.();
			queryClient.invalidateQueries({
				queryKey: ["customers", customerId, "vehicles"],
			});
		},
	});

	const onSubmit: SubmitHandler<VehicleForm> = (data) => {
		mutation.mutate({
			...data,
			brand: data.brand.value,
			model: data.model.value,
		});
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
				<DialogCloseTrigger />
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Vehicule</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<VStack gap={4}>
							<SelectBrand
								required
								label="Brand"
								name="brand"
								control={control}
								placeholder="Search and select brand"
							/>
							<SelectBrandModel
								required
								brandId={watchedBrand?.value}
								label="Model"
								name="model"
								control={control}
								placeholder="Select or seach a brand"
							/>
							<Field
								label="Year"
								invalid={!!errors.year}
								errorText={errors.year?.message}
							>
								<Input
									id={useId()}
									{...register("year", {
										valueAsNumber: true,
									})}
									placeholder="Type a year"
									type="number"
								/>
							</Field>
							<Field
								required
								label="License Plate"
								invalid={!!errors.license_plate}
								errorText={errors.license_plate?.message}
							>
								<Input
									id={useId()}
									{...register("license_plate", {
										required: "License plate is required",
									})}
									placeholder="Type a license plate"
								/>
							</Field>
							<Field
								label="VIN"
								invalid={!!errors.vin}
								errorText={errors.vin?.message}
							>
								<Input
									id={useId()}
									{...register("vin", {
										required: "VIN is required",
									})}
									placeholder="Type a VIN"
								/>
							</Field>
						</VStack>
					</DialogBody>
					<DialogFooter gap={2}>
						<DialogActionTrigger asChild>
							<Button variant="subtle" disabled={isSubmitting}>
								Cancel
							</Button>
						</DialogActionTrigger>
						<Button
							variant="solid"
							type="submit"
							disabled={!isValid}
							loading={isSubmitting}
						>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</DialogRoot>
	);
};

export default EditVehicle;
