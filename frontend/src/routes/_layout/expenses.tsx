import {
  Container,
  Flex,
  Heading,
  HStack,
  Table,
  Tag,
  Text,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { type ColumnDef, flexRender } from "@tanstack/react-table"
import { useCallback, useState } from "react"
import DatePicker from "react-datepicker"
import {
  type ExpensePublic,
  ExpenseSearchSchema,
  ExpensesService,
} from "@/client"
import { ActionsMenu } from "@/components/Common/ActionsMenu"
import ColumnVisibilityControl from "@/components/Common/ColumnVisibilityControl"
import EmptyData from "@/components/Common/EmptyData"
import PageHeader from "@/components/Common/PageHeader"
import Paginator from "@/components/Common/Paginator"
import SearchInput from "@/components/Common/SearchInput"
import SortableHeader from "@/components/Common/SortableHeader"
import AddExpense from "@/components/Expenses/AddExpense"
import DeleteExpense from "@/components/Expenses/DeleteExpense"
import EditExpense from "@/components/Expenses/EditExpense"
import PendingExpenses from "@/components/Pending/PendingExpenses"
import { useDrfTable } from "@/hooks/useDrfTable"

export const Route = createFileRoute("/_layout/expenses")({
  component: Expenses,
  validateSearch: (search) => ExpenseSearchSchema.parse(search),
})

function getExpensesQueryOptions({
  ordering,
  page,
  size,
  search,
}: {
  ordering: string
  page: number
  size: number
  search: string
}) {
  return {
    queryFn: () =>
      ExpensesService.readExpenses({ ordering, page, size, search }),
    queryKey: ["expenses", { ordering, page, size, search }],
  }
}

function Expenses() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { ordering, page, size, search } = Route.useSearch()
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [startDate, endDate] = dateRange

  const { data, isLoading } = useQuery({
    ...getExpensesQueryOptions({ ordering, page, size, search }),
    placeholderData: (prevData) => prevData,
  })

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
      // size: 200,
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
      // size: 200,
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
          <EditExpense expense={row.original} />
          <DeleteExpense id={row.getValue("id")} />
        </ActionsMenu>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
  ]

  const { table } = useDrfTable<ExpensePublic>({
    data: data?.results || [],
    columns,
    totalCount: data?.count || 0,
    onSortingChange: (ordering) => {
      setOrdering(ordering)
    },
  })

  const items = data?.results ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingExpenses />
  }

  if (items.length === 0 && !search?.length) {
    return (
      <EmptyData
        action={<AddExpense />}
        title="You don't have any expense yet"
        description="Add a new expense to get started"
      />
    )
  }

  return (
    <Container maxW="full">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <PageHeader
          title="Expense management"
          description="Manage your expenses and their details"
        />
        <AddExpense />
      </Flex>
      <Flex justifyContent="space-between" alignItems="end" mb={4}>
        <Heading size="lg">
          {search?.length ? "Found" : "All"} Expenses{" "}
          <Text display="inline" color="grey">
            ({count})
          </Text>
        </Heading>
        <HStack>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update)
            }}
            isClearable={true}
          />
          <SearchInput value={search} onSearch={setSearch} />
          <ColumnVisibilityControl table={table} />
        </HStack>
      </Flex>
      <Table.ScrollArea borderWidth="1px">
        <Table.Root variant="outline" size={{ base: "md" }} rounded="sm">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <SortableHeader<ExpensePublic>
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
      </Table.ScrollArea>
      <Paginator
        count={count}
        size={size}
        page={page}
        onPageSizeChange={(pageSize) => {
          setSize(pageSize)
        }}
        onPageChange={(page) => {
          setPage(page)
        }}
      />
    </Container>
  )
}
