import { Box, Container, Flex, Tag, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useCallback } from "react";
import {
	CategoriesSearchSchema,
	CategoriesService,
	type CategoryPublic,
} from "@/client";
import AddCategory from "@/components/Categories/AddCategory";
import DeleteCategory from "@/components/Categories/DeleteCategory";
import EditCategory from "@/components/Categories/EditCategory";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";

export const Route = createFileRoute("/_layout/categories")({
	head: () => ({
		title: "Categories",
		meta: [{ title: "Categories | Naafi" }],
	}),
	component: Categories,
	validateSearch: (search) => CategoriesSearchSchema.parse(search),
});

function getCategoriesQueryOptions({
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
		queryFn: () =>
			CategoriesService.readCategories({ ordering, page, size, search }),
		queryKey: ["categories", { ordering, page, size, search }],
	};
}

function Categories() {
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
		...getCategoriesQueryOptions({ ordering, page, size, search }),
		placeholderData: (prevData) => prevData,
	});

	const columns: ColumnDef<CategoryPublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 90,
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
			accessorKey: "type",
			header: "Type",
			enableSorting: true,
			cell: ({ row }) => (
				<Tag.Root>
					<Tag.Label>{row.getValue("type")}</Tag.Label>
				</Tag.Root>
			),
		},
		{
			id: "parentName",
			accessorFn: (row) => row.parent_category?.name ?? "—",
			header: "Parent",
			enableSorting: true,
			cell: ({ row }) => (
				<Text truncate fontWeight="semibold" color="grey">
					{row.getValue("parentName")}
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
			header: "Actions",
			cell: ({ row }) => (
				<ActionsMenu>
					<EditCategory category={row.original} />
					<DeleteCategory id={row.getValue("id")} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	];

	const columnVisibility: VisibilityState = {
		id: true,
		name: true,
		type: true,
		parent: true,
		created_at: false,
		updated_at: false,
	};

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Category management"
					description="Manage your categories and their details"
				/>
				<AddCategory />
			</Flex>
			<Box maxW="full">
				<DrfList<CategoryPublic>
					title="Categories"
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
			</Box>
		</Container>
	);
}
