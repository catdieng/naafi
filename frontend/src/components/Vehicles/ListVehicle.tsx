import { ButtonGroup, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import {
	CustomersService,
	type PaginatedRequestParams,
	type VehiclePublic,
} from "@/client";
import DrfList from "../Common/DRFList";
import { Button } from "../ui/button";

interface VehicleListProps {
	customerId: number;
}

function getCustomerVehiclesQueryOptions({
	customerId,
	ordering,
	page,
	search,
	size,
}: PaginatedRequestParams & VehicleListProps) {
	return {
		queryFn: () =>
			CustomersService.readVehicles({
				customer_pk: customerId,
				ordering,
				page,
				search,
				size,
			}),
		queryKey: [
			"customers",
			customerId,
			"vehicles",
			{ ordering, search, page, size },
		],
	};
}

const ListVehicle = ({
	customerId,
	onEdit,
	onDelete,
}: VehicleListProps & {
	onEdit: (vehicle: VehiclePublic) => void;
	onDelete: (vehiculeId: number) => void;
}) => {
	const [ordering, setOrdering] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [size, setSize] = useState<number>(10);

	const { data, isLoading } = useQuery({
		...getCustomerVehiclesQueryOptions({
			customerId,
			ordering,
			search,
			page,
			size,
		}),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<VehiclePublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 30,
			enableColumnFilter: false,
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
		},
		{
			accessorKey: "brand_name",
			header: "Brand",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("brand_name")}
				</Text>
			),
		},
		{
			accessorKey: "model_name",
			header: "Model",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("model_name")}
				</Text>
			),
		},
		{
			accessorKey: "year",
			header: "Year",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("year")}
				</Text>
			),
		},
		{
			accessorKey: "license_plate",
			header: "License Plate",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("license_plate")}
				</Text>
			),
		},
		{
			accessorKey: "vin",
			header: "VIN",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="medium">
					{row.getValue("vin")}
				</Text>
			),
		},
		{
			accessorKey: "created_at",
			header: "Created At",
			enableSorting: true,
			cell: ({ row }) => (
				<Text>{new Date(row.getValue("created_at")).toLocaleDateString()}</Text>
			),
		},
		{
			accessorKey: "updated_at",
			header: "Updated At",
			enableSorting: true,
			cell: ({ row }) => (
				<Text>{new Date(row.getValue("updated_at")).toLocaleString()}</Text>
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
							onEdit(row.original);
						}}
					>
						Edit
					</Button>
					<Button
						size="xs"
						colorPalette="red"
						onClick={() => row.original?.id && onDelete(row.original?.id)}
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

	const columnVisibility: VisibilityState = {
		id: true,
		year: true,
		license_plate: true,
		vin: true,
		created_at: false,
		updated_at: false,
	};

	return (
		<DrfList<VehiclePublic>
			title="Vehicles"
			columns={columns}
			initialColumnVisibility={columnVisibility}
			data={data?.results ?? []}
			totalCount={data?.count ?? 0}
			page={page}
			size={size}
			tableSize="sm"
			search={search}
			isLoading={isLoading}
			onSearchChange={setSearch}
			onPageChange={setPage}
			onPageSizeChange={setSize}
			onOrderingChange={setOrdering}
		/>
	);
};

export default ListVehicle;
