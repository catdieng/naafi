import {
	ButtonGroup,
	Flex,
	Heading,
	HStack,
	Input,
	Separator,
	Text,
	VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type BrandPublic,
	BrandsService,
	VehicleModelFormSchema,
	type VehicleModelFormValues,
	type VehicleModelPublic,
} from "@/client";
import DeleteBrandModel from "@/components/Brands/DeleteBrandModel";
import useCustomToast from "@/hooks/useCustomToast";
import DrfList from "../Common/DRFList";
import SearchInput from "../Common/SearchInput";
import { Button } from "../ui/button";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
} from "../ui/dialog";
import { Field } from "../ui/field";

interface ManageBrandModelsProps {
	brand: BrandPublic;
	open: boolean;
	onClose: () => void;
}

function getBrandModelsQueryOptions({
	brand,
	ordering,
	search,
	page,
	size,
}: {
	brand: BrandPublic;
	ordering?: string;
	search?: string;
	page?: number;
	size?: number;
}) {
	return {
		queryFn: () =>
			BrandsService.readModels({
				brand_pk: brand.id,
				size,
				page,
				ordering,
				search,
			}),
		queryKey: ["brands", brand.id, "models"],
	};
}

const ManageBrandModels = ({
	brand,
	open,
	onClose,
}: ManageBrandModelsProps) => {
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();
	const [editedModelId, setEditedModelId] = useState<number | null>();
	const [deletedId, setDeletedId] = useState<number | null>();
	const [ordering, setOrdering] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [size, setSize] = useState<number>(10);

	const {
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
		register,
		reset,
	} = useForm<VehicleModelFormValues>({
		mode: "onBlur",
		criteriaMode: "all",
		resolver: zodResolver(VehicleModelFormSchema),
		defaultValues: {
			name: "",
		},
	});

	const { data, isLoading } = useQuery({
		...getBrandModelsQueryOptions({ brand, ordering, search, page, size }),
		queryKey: ["brands", brand.id, "models", { ordering, search, page, size }],
		enabled: open,
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<VehicleModelPublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 30,
			enableColumnFilter: false,
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
		},
		{
			accessorKey: "name",
			header: "Name",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("name")}
				</Text>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<ButtonGroup size="sm">
					<Button
						size="xs"
						colorPalette="yellow"
						onClick={() => {
							setEditedModelId(row.original.id);
							reset({ name: row.original.name });
						}}
					>
						Edit
					</Button>
					<Button
						size="xs"
						colorPalette="red"
						onClick={() => setDeletedId(row.original.id)}
					>
						Delete
					</Button>
				</ButtonGroup>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	const mutation = useMutation({
		mutationFn: (data: VehicleModelFormValues) =>
			BrandsService.createModel({
				brand_pk: brand.id,
				requestBody: { brand: brand.id, ...data },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [
					"brands",
					brand.id,
					"models",
					{ ordering, search, page, size },
				],
			});
			reset();
			showSuccessToast("Brand model saved successfully.");
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: VehicleModelFormValues) =>
			BrandsService.updateModel({
				brand_pk: brand.id,
				id: editedModelId!,
				requestBody: { brand: brand.id, ...data },
			}),
		onSuccess: () => {
			reset();
			queryClient.invalidateQueries({
				queryKey: ["brands", brand.id, "models"],
			});
			showSuccessToast("Brand model updated successfully.");
			setEditedModelId(undefined);
		},
	});

	const onSubmit: SubmitHandler<VehicleModelFormValues> = async (data) => {
		if (editedModelId) {
			updateMutation.mutate(data);
		} else {
			mutation.mutate(data);
		}
	};

	const onReset = () => {
		reset();
		setEditedModelId(undefined);
	};

	return (
		<DialogRoot
			size={{ base: "xs", md: "lg" }}
			placement="center"
			open={open}
			onOpenChange={({ open }) => !open && onClose()}
			onExitComplete={() => {
				setDeletedId(null);
				setEditedModelId(null);
			}}
		>
			<DialogContent>
				<DialogCloseTrigger />
				<DialogHeader>
					<DialogTitle>Manage Brand Models</DialogTitle>
				</DialogHeader>
				<DialogBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Text>{editedModelId ? "Edit" : "Add"} a brand model</Text>

						<VStack mt={4} gap={4}>
							<Field
								required
								invalid={!!errors.name}
								errorText={errors.name?.message}
								label="Name"
							>
								<Input
									id={useId()}
									{...register("name", {
										required: "Name is required.",
									})}
									placeholder="Name"
									type="text"
								/>
							</Field>
							<HStack w="full" justifyContent="flex-end">
								<Button
									size="sm"
									type="reset"
									variant="subtle"
									disabled={isSubmitting}
									onClick={onReset}
								>
									Cancel
								</Button>
								<Button
									size="sm"
									type="submit"
									disabled={!isValid || isSubmitting}
									loading={isSubmitting}
								>
									{editedModelId ? " Save changes" : "Save"}
								</Button>
							</HStack>
						</VStack>
					</form>
					<Separator my={4} />

					<Flex my={4} justify="space-between">
						<Heading size="md" my={4}>
							Models
						</Heading>
						<SearchInput size="xs" value={search} onSearch={setSearch} />
					</Flex>
					<DrfList<VehicleModelPublic>
						columns={columns}
						data={data?.results ?? []}
						totalCount={data?.count ?? 0}
						page={page}
						size={size}
						onOrderingChange={setOrdering}
						onPageChange={setPage}
						onPageSizeChange={setSize}
						onSearchChange={setSearch}
						isLoading={isLoading}
					/>
					{deletedId && (
						<DeleteBrandModel
							brandId={brand.id}
							id={deletedId}
							open
							onClose={() => setDeletedId(null)}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};

export default ManageBrandModels;
