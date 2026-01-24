import { Box, Container, Flex, Link, Separator, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { FaCarAlt, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
	type CustomerPublic,
	CustomersSearchSchema,
	CustomersService,
} from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddCustomer from "@/components/Customers/AddCustomer";
import DeleteCustomer from "@/components/Customers/DeleteCustomer";
import EditCustomer from "@/components/Customers/EditCustomer";
import ManageCustomerVehicles from "@/components/Customers/ManageCustomerVehicles";
import { MenuItem } from "@/components/ui/menu";

export const Route = createFileRoute("/_layout/customers")({
	head: () => ({
		title: "Customers",
		meta: [{ title: "Customers | Naafi" }],
	}),
	component: customers,
	validateSearch: (search) => CustomersSearchSchema.parse(search),
});

function getCustomersQueryOptions({
	ordering,
	page,
	search,
	size,
}: {
	ordering: string;
	page: number;
	search: string;
	size: number;
}) {
	return {
		queryFn: () =>
			CustomersService.readCustomers({ ordering, page, search, size }),
		queryKey: ["customers", { ordering, page, search, size }],
	};
}

function customers() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { ordering, page, size, search } = Route.useSearch();

	const [editedCustomer, setEditedCustomer] = useState<CustomerPublic | null>();
	const [managedCustomer, setManagedCustomer] =
		useState<CustomerPublic | null>();
	const [deletedCustomer, setDeletedCustomer] = useState<number | null>();

	const setOrdering = useCallback(
		(ordering: string) =>
			navigate({
				search: (prev: { [key: string]: string }) => ({
					...prev,
					page: 1,
					ordering,
				}),
			}),
		[navigate],
	);

	const setPage = useCallback(
		(page: number) =>
			navigate({
				search: (prev: { [key: string]: string }) => ({ ...prev, page }),
			}),
		[navigate],
	);

	const setSize = useCallback(
		(size: number) =>
			navigate({
				search: (prev: { [key: string]: string }) => ({
					...prev,
					page: 1,
					size,
				}),
			}),
		[navigate],
	);

	const setSearch = useCallback(
		(search: string) =>
			navigate({
				search: (prev: { [key: string]: string }) => ({
					...prev,
					page: 1,
					search,
				}),
			}),
		[navigate],
	);

	const { data, isLoading } = useQuery({
		...getCustomersQueryOptions({ ordering, page, size, search }),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<CustomerPublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 30,
			enableColumnFilter: false,
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
		},
		{
			accessorKey: "full_name",
			header: "Full Name",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold">
					{row.getValue("full_name")}
				</Text>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			enableSorting: true,
			cell: ({ row }) => (
				<Link href={`mailto:${row.getValue("email")}`} color="gray.500">
					{row.getValue("email")}
				</Link>
			),
		},
		{
			accessorKey: "phone",
			header: "Phone",
			enableSorting: false,
			cell: ({ row }) => <Text>{row.getValue("phone") || "-"}</Text>,
		},
		{
			accessorKey: "address",
			header: "Address",
			enableSorting: false,
			cell: ({ row }) => (
				<Text truncate maxW="200px">
					{row.getValue("address") || "-"}
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
				<ActionsMenu>
					<MenuItem
						value="edit-customer"
						onClick={() => {
							setEditedCustomer(row.original);
						}}
					>
						<FaEdit /> Edit
					</MenuItem>
					<MenuItem
						value="manage-vehicle"
						onClick={() => {
							setManagedCustomer(row.original);
						}}
					>
						<FaCarAlt /> Manage vehicles
					</MenuItem>
					<MenuItem
						value="delete-customer"
						onClick={() => {
							setDeletedCustomer(row.original.id);
						}}
					>
						<FaTrashAlt /> Delete
					</MenuItem>
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
		},
	];

	const columnVisibility: VisibilityState = {
		id: true,
		full_name: true,
		email: true,
		phone: true,
		address: false,
		created_at: false,
		updated_at: false,
	};

	return (
		<Box h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Customers" />
				<AddCustomer />
			</Flex>
			<Separator mt={2} mb={8} />
			<Container maxW="full">
				<DrfList
					title="Customer"
					columns={columns}
					initialColumnVisibility={columnVisibility}
					data={data?.results ?? []}
					totalCount={data?.count ?? 0}
					page={page}
					size={size}
					search={search}
					isLoading={isLoading}
					onSearchChange={setSearch}
					onPageChange={setPage}
					onPageSizeChange={setSize}
					onOrderingChange={setOrdering}
				/>
				{editedCustomer && (
					<EditCustomer
						customer={editedCustomer}
						open
						onClose={() => setEditedCustomer(null)}
					/>
				)}
				{managedCustomer && (
					<ManageCustomerVehicles
						customer={managedCustomer}
						open
						onClose={() => setManagedCustomer(null)}
					/>
				)}
				{deletedCustomer && (
					<DeleteCustomer
						id={deletedCustomer}
						open
						onClose={() => setDeletedCustomer(null)}
					/>
				)}
			</Container>
		</Box>
	);
}
