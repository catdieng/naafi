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

import { type ItemPublic, ItemsSearchSchema, ItemsService } from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import EmptyData from "@/components/Common/EmptyData";
import PageHeader from "@/components/Common/PageHeader";
import Paginator from "@/components/Common/Paginator";
import SearchInput from "@/components/Common/SearchInput";
import SortableHeader from "@/components/Common/SortableHeader";
import AddItem from "@/components/Items/AddItem";
import DeleteItem from "@/components/Items/DeleteItem";
import EditItem from "@/components/Items/EditItem";
import PendingItems from "@/components/Pending/PendingItems";
import { useDrfTable } from "@/hooks/useDrfTable";

export const Route = createFileRoute("/_layout/items")({
	component: Items,
	validateSearch: (search) => ItemsSearchSchema.parse(search),
});

function getItemsQueryOptions({
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
		queryFn: () => ItemsService.readItems({ ordering, page, size, search }),
		queryKey: ["items", { ordering, page, size, search }],
	};
}

function Items() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { ordering, page, size, search } = Route.useSearch();

	const { data, isLoading } = useQuery({
		...getItemsQueryOptions({ ordering, page, search, size }),
		placeholderData: (prevData) => prevData,
	});

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

	const columns: ColumnDef<ItemPublic>[] = [
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
			accessorKey: "price",
			header: "Price",
			enableSorting: true,
			// size: 200,
			cell: ({ row }) => <Text>{row.getValue("price")}</Text>,
		},
		{
			accessorKey: "duration",
			header: "Duration",
			enableSorting: true,
			// size: 200,
			cell: ({ row }) => <Text>{row.getValue("duration")}</Text>,
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<ActionsMenu>
					<EditItem item={row.original} />
					<DeleteItem id={row.original.id} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	const { table } = useDrfTable<ItemPublic>({
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
		return <PendingItems />;
	}

	if (items.length === 0 && !search?.length) {
		return (
			<EmptyData
				action={<AddItem />}
				title="You don't have any item yet"
				description="Add a new item to get started"
			/>
		);
	}

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Item management"
					description="Manage your items and their details"
				/>
				<AddItem />
			</Flex>
			<Flex justifyContent="space-between" alignItems="end" mb={4}>
				<Heading size="lg">
					{search?.length ? "Found" : "All"} Items{" "}
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
								<SortableHeader<ItemPublic>
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
		</Container>
	);
}
