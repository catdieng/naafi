import { Box, Container, Flex, Separator, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";

import { type ItemPublic, ItemsSearchSchema, ItemsService } from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddItem from "@/components/Items/AddItem";
import DeleteItem from "@/components/Items/DeleteItem";
import EditItem from "@/components/Items/EditItem";

export const Route = createFileRoute("/_layout/items")({
	head: () => ({
		title: "Items",
		meta: [
			{
				title: "Items | Naafi",
			},
			{
				name: "description",
				description: "List of items",
			},
		],
	}),
	component: Items,
	validateSearch: (search) => ItemsSearchSchema.parse(search),
});

function getItemsQueryOptions({
	ordering,
	page,
	search,
	size,
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
			cell: ({ row }) => <Text>{row.getValue("price")}</Text>,
		},
		{
			accessorKey: "duration",
			header: "Duration",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("duration")}</Text>,
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
					<EditItem item={row.original} />
					<DeleteItem id={row.original.id} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	return (
		<Box h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center" px={8} pt={2}>
				<PageHeader title="Items" />
				<AddItem />
			</Flex>
			<Separator mt={2} mb={8} />
			<Container maxW="full">
				<DrfList
					title="Items"
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
			</Container>
		</Box>
	);
}
