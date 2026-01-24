import { Box, Container, Flex, Separator, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import {
	type InvoicePublic,
	InvoiceSearchSchema,
	InvoicesService,
} from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddInvoice from "@/components/Invoices/AddInvoice";
import EditInvoice from "@/components/Invoices/EditInvoice";

export const Route = createFileRoute("/_layout/invoices/")({
	head: () => ({
		title: "Invoices",
		meta: [
			{ title: "Invoices | Naafi" },
			{
				name: "description",
				content: "Invoices page",
			},
		],
	}),
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

	return (
		<DrfList<InvoicePublic>
			title="Invoices"
			columns={columns}
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
	);
}

function Invoices() {
	return (
		<Box h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Invoices" />
				<AddInvoice />
			</Flex>
			<Separator mt={2} mb={8} />

			<Container maxW="full">
				<InvoicesTable />
			</Container>
		</Box>
	);
}
