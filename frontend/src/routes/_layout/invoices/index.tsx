import {
	Container,
	Flex,
	Heading,
	HStack,
	Table,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { useCallback } from "react";
import {
	type InvoicePublic,
	InvoiceSearchSchema,
	InvoicesService,
} from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import ColumnVisibilityControl from "@/components/Common/ColumnVisibilityControl";
import EmptyData from "@/components/Common/EmptyData";
import PageHeader from "@/components/Common/PageHeader";
import Paginator from "@/components/Common/Paginator";
import SearchInput from "@/components/Common/SearchInput";
import SortableHeader from "@/components/Common/SortableHeader";
import AddInvoice from "@/components/Invoices/AddInvoice";
import EditInvoice from "@/components/Invoices/EditInvoice";
import Pending from "@/components/Pending/Pending";
import { useDrfTable } from "@/hooks/useDrfTable";

export const Route = createFileRoute("/_layout/invoices/")({
	component: Invoices,
	validateSearch: (search) => InvoiceSearchSchema.parse(search),
});

function getInvoicesQueryOptions({
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
			InvoicesService.readInvoices({ ordering, page, search, size }),
		queryKey: ["invoices", { ordering, page, search, size }],
	};
}

function InvoicesTable() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { ordering, page, size, search } = Route.useSearch();

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
		...getInvoicesQueryOptions({ ordering, page, size, search }),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<InvoicePublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 30,
			enableColumnFilter: false,
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
		},
		{
			accessorKey: "invoice_number",
			header: "Invoice Number",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("invoice_number")}</Text>,
		},
		{
			accessorKey: "customer",
			header: "Customer",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.original.customer.full_name}</Text>,
		},
		{
			accessorKey: "total",
			header: "Total",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("total")}</Text>,
		},
		{
			accessorKey: "issue_date",
			header: "Issue Date",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("issue_date")}</Text>,
		},
		{
			accessorKey: "due_date",
			header: "Due Date",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("due_date")}</Text>,
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
					<EditInvoice invoice={row.original} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	const { table } = useDrfTable<InvoicePublic>({
		data: data?.results || [],
		columns,
		totalCount: data?.count || 0,
		initialColumnVisibility: {
			id: true,
			invoice_number: true,
			total: true,
			issue_date: true,
			due_date: true,
			customer: true,
			created_at: false,
			updated_at: false,
		},
		onSortingChange: (ordering) => {
			setOrdering(ordering);
		},
	});

	const items = data?.results ?? [];
	const count = data?.count ?? 0;

	if (isLoading) {
		return (
			<Pending columns={["ID", "Customer", "Amount", "Status", "Actions"]} />
		);
	}

	if (items.length === 0 && !search?.length) {
		return (
			<EmptyData
				action={<AddInvoice />}
				title="You don't have any invoice yet"
				description="Add a new invoice to get started"
			/>
		);
	}

	return (
		<>
			<Flex justifyContent="space-between" alignItems="end" mb={4}>
				<Heading size="lg">
					{search?.length ? "Found" : "All"} Invoices{" "}
					<Text display="inline" color="grey">
						({count})
					</Text>
				</Heading>
				<HStack>
					<SearchInput value={search} onSearch={setSearch} />
					<ColumnVisibilityControl table={table} />
				</HStack>
			</Flex>
			<Table.Root variant="outline" size={{ base: "md" }} rounded="sm">
				<Table.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Row key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<SortableHeader<InvoicePublic>
									key={header.id}
									header={header}
									orderingKey={header.column.id}
								/>
							))}
						</Table.Row>
					))}
				</Table.Header>
				<Table.Body>
					{table.getRowModel().rows.map((row) => (
						<Table.Row key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Table.Cell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
			<Paginator
				count={count}
				size={size}
				page={page}
				onPageSizeChange={(pageSize) => {
					setSize(pageSize);
				}}
				onPageChange={(page) => {
					setPage(page);
				}}
			/>
		</>
	);
}

function Invoices() {
	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Invoice management"
					description="Manage your invoices and their details"
				/>
				<AddInvoice />
			</Flex>
			<InvoicesTable />
		</Container>
	);
}
