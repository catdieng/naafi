import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { TaxesService, type TaxPublic } from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddTax from "@/components/Taxes/AddTax";
import DeleteTax from "@/components/Taxes/DeleteTax";
import EditTax from "@/components/Taxes/EditTax";

export const Route = createFileRoute("/_layout/settings/taxes")({
	component: Taxes,
});

function getTaxesQueryOptions({
	ordering,
	page,
	size,
	search,
}: {
	ordering: string;
	page: number;
	size: number;
	search: string;
}) {
	return {
		queryFn: () => TaxesService.readTaxes({ ordering, page, size, search }),
		queryKey: ["taxes", { ordering, page, size, search }],
	};
}

function Taxes() {
	const [ordering, setOrdering] = useState("");
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const [search, setSearch] = useState("");

	const { data, isLoading } = useQuery({
		...getTaxesQueryOptions({ ordering, page, size, search }),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<TaxPublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			enableColumnFilter: false,
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("id")}</Text>,
		},
		{
			accessorKey: "name",
			header: "Name",
			enableSorting: true,
			cell: ({ row }) => <Text truncate>{row.getValue("name")}</Text>,
		},
		{
			accessorKey: "rate",
			header: "Rate",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold">
					{row.getValue("rate")}
				</Text>
			),
		},
		{
			accessorKey: "rate_type",
			header: "Type",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold">
					{row.getValue("rate_type")}
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
					<EditTax tax={row.original} />
					<DeleteTax id={row.getValue("id")} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Taxes"
					description="Manage your tax settings and preferences"
				/>
				<AddTax />
			</Flex>
			<Box maxW="full">
				<DrfList<TaxPublic>
					title="Taxes"
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
			</Box>
		</Container>
	);
}
