import {
	Box,
	Container,
	Flex,
	Heading,
	HStack,
	Table,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { useState } from "react";
import type { TaxPublic } from "@/client";
import { TaxesService } from "@/client/services/taxes.service";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import EmptyData from "@/components/Common/EmptyData";
import PageHeader from "@/components/Common/PageHeader";
import Paginator from "@/components/Common/Paginator";
import SearchInput from "@/components/Common/SearchInput";
import SortableHeader from "@/components/Common/SortableHeader";
import PendingTaxes from "@/components/Taxes/AddTax";
import AddTax from "@/components/Taxes/AddTax";
import DeleteTax from "@/components/Taxes/DeleteTax";
import EditTax from "@/components/Taxes/EditTax";
import { useDrfTable } from "@/hooks/useDrfTable";

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

const TaxesSettings = () => {
	const [ordering, setOrdering] = useState("");
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(15);
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
			// size: 200,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold">
					{row.getValue("name")}
				</Text>
			),
		},
		{
			accessorKey: "rate",
			header: "Rate",
			enableSorting: true,
			// size: 200,
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
			// size: 200,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold">
					{row.getValue("rate_type")}
				</Text>
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

	const { table } = useDrfTable<TaxPublic>({
		data: data?.results || [],
		columns,
		totalCount: data?.count || 0,
		onSortingChange: (ordering) => {
			setOrdering(ordering);
		},
	});

	const items = data?.results ?? [];
	const count = data?.count ?? 0;

	if (isLoading) {
		return <PendingTaxes />;
	}

	if (items.length === 0 && !search?.length) {
		return (
			<EmptyData
				action={<AddTax />}
				title="You don't have any tax yet"
				description="Add a new tax to get started"
			/>
		);
	}

	return (
		<Box maxW="full">
			<Flex justifyContent="space-between" alignItems="end" mb={4}>
				<Heading size="lg">
					{search?.length ? "Found" : "All"} Taxes{" "}
					<Text display="inline" color="grey">
						({count})
					</Text>
				</Heading>
				<HStack>
					<SearchInput value={search} onSearch={setSearch} />
				</HStack>
			</Flex>
			<Table.Root size="md" variant="outline" rounded="sm">
				<Table.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Row key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<SortableHeader<TaxPublic>
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
		</Box>
	);
};

export default TaxesSettings;
