import { DialogTitle, Input, Link, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import {
	type ApiError,
	CustomersService,
	type VehicleCreate,
	type VehicleForm,
	VehicleFormSchema,
	type VehiclePublic,
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
	DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";

interface AddVehiculeProps {
	customerId: number;
	appearance?: "link" | "button";
	onVehicleCreated?: (vehicule: VehiclePublic) => void;
}

const AddVehicule = ({
	customerId,
	appearance = "button",
	onVehicleCreated,
}: AddVehiculeProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const {
		control,
		formState: { errors, isValid, isSubmitting },
		getValues,
		handleSubmit,
		register,
		reset,
		watch,
	} = useForm<VehicleForm>({
		mode: "onChange",
		criteriaMode: "all",
		resolver: zodResolver(VehicleFormSchema),
		defaultValues: {
			customer: customerId,
		},
	});

	const yearId = useId();
	const plateId = useId();
	const vinId = useId();

	const watchedBrand = watch("brand");

	const mutation = useMutation({
		mutationFn: (data: VehicleCreate) =>
			CustomersService.createVehicle({
				customer_pk: customerId,
				requestBody: data,
			}),
		onSuccess: (data) => {
			setIsOpen(false);
			showSuccessToast("Vehicle created successfully");
			reset();
			onVehicleCreated?.(data);
		},
		onError: (error: ApiError) => {
			handleError(error);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["customers", customerId, "vehicles"],
			});
		},
	});

	const onSubmit: SubmitHandler<VehicleForm> = (data) => {
		mutation.mutate({
			...data,
			brand: data.brand!.value,
			model: data.model!.value,
		});
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "md" }}
			placement="center"
			open={isOpen}
			onOpenChange={({ open }) => {
				setIsOpen(open);
			}}
			onRequestDismiss={() => {
				reset();
			}}
		>
			<DialogTrigger asChild>
				{appearance === "button" ? (
					<Button value="add-vehicule" size="sm">
						<FaPlus fontSize="16px" />
						Add Vehicule
					</Button>
				) : (
					<Link href="#">
						<FaPlus fontSize="16px" />
						Add Vehicule
					</Link>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogCloseTrigger />
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Add Vehicule</DialogTitle>
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
									id={yearId}
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
									id={plateId}
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
									id={vinId}
									{...register("vin")}
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

export default AddVehicule;
