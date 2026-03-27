import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AsyncCreatableSelect } from "chakra-react-select";
import { useCallback, useEffect, useState } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	Controller,
} from "react-hook-form";
import {
	type ApiError,
	type BrandCreate,
	BrandsService,
	debounce,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Field } from "../ui/field";

interface SelectBrandProps<TFieldValues extends FieldValues> {
	required?: boolean;
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	label?: string;
	placeholder?: string;
}

interface OptionType {
	label: string;
	value: number;
}

function SelectBrand<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	required,
}: SelectBrandProps<TFieldValues>) {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const [brandList, setBrandList] = useState<OptionType[]>([]);

	// Load initial brands
	const { data: brands } = useQuery({
		queryKey: ["brands"],
		queryFn: () => BrandsService.readBrands(),
		staleTime: 5 * 60 * 1000,
	});

	// Update brandList when data is loaded
	useEffect(() => {
		if (brands?.results) {
			setBrandList(
				brands.results.map((item) => ({
					label: item.name,
					value: item.id,
				})),
			);
		}
	}, [brands]);

	// Async search function with debounce
	const loadOptions = useCallback(
		debounce(
			async (inputValue: string, callback: (options: OptionType[]) => void) => {
				try {
					if (!inputValue) return callback(brandList);

					const options = await queryClient.fetchQuery({
						queryKey: ["brands", inputValue],
						queryFn: async () => {
							const { results } = await BrandsService.readBrands({
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
		[],
	);

	const mutationCreateBrand = useMutation({
		mutationFn: (data: BrandCreate) =>
			BrandsService.createBrand({ requestBody: data }),
		onSuccess: (newBrand) => {
			const option: OptionType = { label: newBrand.name, value: newBrand.id };

			// Add to local options
			setBrandList((prev) => [...prev, option]);

			// Select the newly created brand in the form
			fieldRef.current?.onChange(option);

			queryClient.invalidateQueries({ queryKey: ["brands"] });
			showSuccessToast("Brand created successfully.");
		},
		onError: (error: ApiError) => handleError(error),
	});

	// Store ref to field to update value in mutation
	const fieldRef = { current: null as any };

	const onCreateBrand = (inputValue: string) => {
		mutationCreateBrand.mutate({ name: inputValue });
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
							defaultOptions={brandList}
							loadOptions={loadOptions}
							onCreateOption={onCreateBrand}
							value={field.value ?? null} // store full option object
							onChange={field.onChange} // store full option object
							onBlur={field.onBlur}
							isClearable
						/>
					</Field>
				);
			}}
		/>
	);
}

export default SelectBrand;
