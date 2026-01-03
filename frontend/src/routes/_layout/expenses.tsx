import { Container, Flex, HStack, Tag, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useCallback, useState } from "react";

import {
	type ExpensePublic,
	ExpenseSearchSchema,
	ExpensesService,
} from "@/client";
import { ActionsMenu } from "@/components/Common/ActionsMenu";
import DrfList from "@/components/Common/DRFList";
import PageHeader from "@/components/Common/PageHeader";
import AddExpense from "@/components/Expenses/AddExpense";
import DeleteExpense from "@/components/Expenses/DeleteExpense";
import EditExpense from "@/components/Expenses/EditExpense";

export const Route = createFileRoute("/_layout/expenses")({
	head: () => ({
		title: "Expenses",
		meta: [{ title: "Expenses | Naafi" }],
	}),
	component: Expenses,
	validateSearch: (search) => ExpenseSearchSchema.parse(search),
});

function getExpensesQueryOptions({
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
			ExpensesService.readExpenses({ ordering, page, size, search }),
		queryKey: ["expenses", { ordering, page, size, search }],
	};
}

function Expenses() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { ordering, page, size, search } = Route.useSearch();
	const [selectedDates, setSelectedDates] = useState<Date[]>([
		new Date(),
		new Date(),
	]);

	const { data, isLoading } = useQuery({
		...getExpensesQueryOptions({ ordering, page, size, search }),
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

	const columns: ColumnDef<ExpensePublic>[] = [
		{
			accessorKey: "id",
			header: "ID",
			size: 30,
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
			accessorKey: "amount",
			header: "Amount",
			enableSorting: true,
			cell: ({ row }) => <Text>{row.getValue("amount")}</Text>,
		},
		{
			accessorKey: "paid",
			header: "Paid",
			enableSorting: true,
			cell: ({ row }) => (
				<Tag.Root colorPalette={row.original.paid ? "green" : "red"}>
					<Tag.Label>{row.original.paid ? "Yes" : "No"}</Tag.Label>
				</Tag.Root>
			),
		},
		{
			accessorKey: "due_date",
			header: "Due date",
			enableSorting: true,
			cell: ({ row }) => (
				<Text>
					{row.getValue("due_date")
						? new Date(row.getValue("due_date")).toLocaleDateString()
						: ""}
				</Text>
			),
		},
		{
			accessorKey: "payment_date",
			header: "Payment date",
			enableSorting: true,
			cell: ({ row }) => (
				<Text>
					{row.getValue("payment_date")
						? new Date(row.getValue("payment_date")).toLocaleDateString()
						: ""}
				</Text>
			),
		},
		{
			accessorKey: "created_at",
			header: "Created At",
			enableSorting: true,
			cell: ({ row }) => (
				<Text>{new Date(row.getValue("created_at")).toLocaleString()}</Text>
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
					<EditExpense expense={row.original} />
					<DeleteExpense id={row.getValue("id")} />
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
		paid: true,
		due_date: true,
		payment_date: true,
		created_at: false,
		updated_at: false,
	};

	return (
		<Container maxW="full">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader
					title="Expense management"
					description="Manage your expenses and their details"
				/>
				<AddExpense />
			</Flex>
			<Flex justify="end" mb={4}>
				<HStack>
					<RangeDatepicker
						selectedDates={selectedDates}
						onDateChange={setSelectedDates}
					/>
				</HStack>
			</Flex>
			<DrfList<ExpensePublic>
				title="Expenses"
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
	);
}
