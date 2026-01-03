import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "chakra-react-select";
import { useEffect, useEffectEvent, useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { CustomersService, type VehiclePublic } from "@/client";
import { Field } from "../ui/field";
import AddVehicule from "../Vehicles/AddVehicule";

export interface SelectVehicleProps {
	required?: boolean;
	disabled?: boolean;
	name: string;
	control: Control<any>;
	label?: string;
	vehicle?: VehiclePublic | null;
	customerId: number;
	placeholder?: string;
}

const SelectVehicle = ({
	required,
	disabled,
	customerId,
	vehicle,
	name,
	control,
	label,
	placeholder,
}: SelectVehicleProps) => {
	const [vehiculeList, setVehiculeList] = useState<
		{ label: string; value: number }[]
	>([]);

	const { data: vehicles, isLoading } = useQuery({
		queryFn: () =>
			CustomersService.readVehicles({ customer_pk: customerId!, size: 30 }),
		queryKey: ["vehicles", customerId],
		enabled: !!customerId,
	});

	const onVehiclePropChanged = useEffectEvent(() => {
		if (vehicle) {
			console.log("vehicle", vehicle);
			setVehiculeList([
				{
					label: `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.license_plate}`,
					value: vehicle.id,
				},
			]);
		}
	});

	const onVehiclesLoaded = useEffectEvent(() => {
		if (vehicles) {
			setVehiculeList(
				vehicles.results.map((el) => ({
					label: `${el.brand_name} ${el.model_name} ${el.license_plate}`,
					value: el.id,
				})),
			);
		}
	});

	useEffect(() => {
		if (vehicle) {
			onVehiclePropChanged();
		}
	}, [vehicle]);

	useEffect(() => {
		if (vehicles?.results.length) {
			onVehiclesLoaded();
		}
	}, [vehicles]);

	return (
		<Box my={4}>
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<>
						<Field
							required={required}
							disabled={disabled}
							label={label}
							invalid={!!fieldState.error}
							errorText={fieldState.error?.message}
							extraActions={
								customerId && (
									<AddVehicule
										customerId={customerId}
										appearance="link"
										onVehicleCreated={(newVehicle) => {
											setVehiculeList([
												...vehiculeList,
												{
													label: `${newVehicle.brand_name} ${newVehicle.model_name} ${newVehicle.license_plate}`,
													value: newVehicle.id,
												},
											]);
											field.onChange(newVehicle.id);
										}}
									/>
								)
							}
						>
							<Select<{ label: string; value: number }>
								placeholder={placeholder}
								isLoading={isLoading}
								options={vehiculeList}
								// value={field.value}
								// onChange={(newValue) => {
								// 	field.onChange(newValue?.value);
								// }}
								{...field}
							/>
						</Field>
					</>
				)}
			/>
		</Box>
	);
};

export default SelectVehicle;
