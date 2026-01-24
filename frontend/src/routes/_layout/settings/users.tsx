import { Container, Flex, Link, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useCallback } from "react";
import { z } from "zod";
import { type UserPublic, UsersService } from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddUser from "@/components/Users/AddUser";
import DeleteUser from "@/components/Users/DeleteUser";
import EditUser from "@/components/Users/EditUser";

const usersSearchSchema = z.object({
	page: z.number().catch(1),
	size: z.number().catch(10),
	search: z.string().optional(),
});

function getUsersQueryOptions({
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
		queryFn: () => UsersService.readUsers({ ordering, page, size, search }),
		queryKey: ["users", { ordering, page, size, search }],
	}
}

export const Route = createFileRoute("/_layout/settings/users")({
	head: () => ({
		title: "Users",
		meta: [
			{
				title: "Users | Naafi",
			},
			{
				name: "description",
				content: "Manage users and theirs details",
			},
		],
	}),
	component: Users,
	validateSearch: (search) => usersSearchSchema.parse(search),
});

function Users() {
	// const queryClient = useQueryClient()
	// const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
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
	)

	const setPage = useCallback(
		(page: number) =>
			navigate({
				search: (prev: { [key: string]: string }) => ({ ...prev, page }),
			}),
		[navigate],
	)

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
	)

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
	)

	const { data, isLoading } = useQuery({
		...getUsersQueryOptions({ ordering, page, search, size }),
		placeholderData: (prevData) => prevData,
	})

	const columns: ColumnDef<UserPublic>[] = [
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
					<EditUser user={row.original} />
					<DeleteUser id={row.original.id} />
				</ActionsMenu>
			),
			enableSorting: false,
			enableColumnFilter: false,
			size: 120,
		},
	]

	const columnVisibility: VisibilityState = {
		id: true,
		full_name: true,
		email: true,
		phone: true,
		address: false,
		created_at: false,
		updated_at: false,
	}

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="User management"
					description="Manage your users and their details"
				/>
				<AddUser />
			</Flex>
			<DrfList
				title="Users"
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
		</Container>
	)
}
