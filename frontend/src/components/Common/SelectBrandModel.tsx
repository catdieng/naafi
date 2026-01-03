import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AsyncCreatableSelect } from "chakra-react-select";
import { useCallback, useEffect, useState } from "react";
import { type Control, Controller } from "react-hook-form";
import {
	type ApiError,
	BrandsService,
	debounce,
	type VehicleModelCreate,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Field } from "../ui/field";

interface OptionType {
	label: string;
	value: number;
}

interface SelectBrandModelProps {
	required?: boolean;
	brandId?: number;
	name: string;
	control: Control<any>;
	label?: string;
	placeholder?: string;
}

const SelectBrandModel = ({
	brandId,
	control,
	label,
	name,
	placeholder,
	required,
}: SelectBrandModelProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const [modelList, setModelList] = useState<OptionType[]>([]);

	// Load models for selected brand
	const { data: models } = useQuery({
		queryKey: ["brandModels", brandId],
		queryFn: () => BrandsService.readModels({ brand_pk: brandId! }),
		enabled: !!brandId,
	});

	useEffect(() => {
		if (models?.results) {
			setModelList(models.results.map((m) => ({ label: m.name, value: m.id })));
		} else {
			setModelList([]);
		}
	}, [models]);

	// Async search
	const loadOptions = useCallback(
		debounce(
			async (inputValue: string, callback: (options: OptionType[]) => void) => {
				if (!inputValue) return callback(modelList);

				try {
					const options = await queryClient.fetchQuery({
						queryKey: ["brandModelsSearch", brandId, inputValue],
						queryFn: async () => {
							const { results } = await BrandsService.readModels({
								brand_pk: brandId!,
								search: inputValue,
							});
							return results.map((c) => ({ label: c.name, value: c.id }));
						},
						staleTime: 5 * 60 * 1000,
					});
					callback(options);
				} catch {
					callback([]);
				}
			},
			300,
		),
		[brandId, modelList, queryClient],
	);

	const mutationCreateModel = useMutation({
		mutationFn: (data: VehicleModelCreate) =>
			BrandsService.createModel({ brand_pk: brandId!, requestBody: data }),
		onSuccess: (newModel) => {
			const option: OptionType = { label: newModel.name, value: newModel.id };

			// Add to local options
			setModelList((prev) => [...prev, option]);

			// Select the newly created model in the form
			fieldRef.current?.onChange(option);
			queryClient.invalidateQueries({ queryKey: ["brandModels", brandId] });
			showSuccessToast("Model created successfully.");
		},
		onError: (error: ApiError) => handleError(error),
	});

	const fieldRef = { current: null as any };

	const onCreateOption = (inputValue: string) => {
		if (!brandId) return;
		mutationCreateModel.mutate({ brand: brandId, name: inputValue });
	};

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				fieldRef.current = field;
				return (
					<Field
						required={required}
						label={label}
						invalid={!!fieldState.error}
						errorText={fieldState.error?.message}
					>
						<AsyncCreatableSelect<OptionType, false>
							placeholder={placeholder}
							defaultOptions={modelList}
							loadOptions={loadOptions}
							onCreateOption={onCreateOption}
							value={field.value ?? null}
							onChange={field.onChange}
							onBlur={field.onBlur}
							isClearable
						/>
					</Field>
				);
			}}
		/>
	);
};

export default SelectBrandModel;
