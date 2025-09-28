import {
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Table,
  Text,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { type ColumnDef, flexRender } from "@tanstack/react-table"
import { useCallback } from "react"
import {
  type CustomerPublic,
  CustomersSearchSchema,
  CustomersService,
} from "@/client"
import { ActionsMenu } from "@/components/Common/ActionsMenu"
import ColumnVisibilityControl from "@/components/Common/ColumnVisibilityControl"
import EmptyData from "@/components/Common/EmptyData"
import PageHeader from "@/components/Common/PageHeader"
import Paginator from "@/components/Common/Paginator"
import SearchInput from "@/components/Common/SearchInput"
import SortableHeader from "@/components/Common/SortableHeader"
import AddCustomer from "@/components/Customers/AddCustomer"
import DeleteCustomer from "@/components/Customers/DeleteCustomer"
import EditCustomer from "@/components/Customers/EditCustomer"
import PendingCustomers from "@/components/Pending/PendingCustomers"
import { useDrfTable } from "@/hooks/useDrfTable"

export const Route = createFileRoute("/_layout/customers")({
  component: customers,
  validateSearch: (search) => CustomersSearchSchema.parse(search),
})

function getCustomersQueryOptions({
  ordering,
  page,
  search,
  size,
}: {
  ordering: string
  page: number
  search: string
  size: number
}) {
  return {
    queryFn: () =>
      CustomersService.readCustomers({ ordering, page, search, size }),
    queryKey: ["customers", { ordering, page, search, size }],
  }
}

function customers() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { ordering, page, size, search } = Route.useSearch()

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
    ...getCustomersQueryOptions({ ordering, page, size, search }),
    placeholderData: (prevData) => prevData,
  })

  const columns: ColumnDef<CustomerPublic>[] = [
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
      // size: 200,
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
      accessorKey: "phone",
      header: "Phone",
      enableSorting: false,
      cell: ({ row }) => <Text>{row.getValue("phone") || "-"}</Text>,
    },
    {
      accessorKey: "address",
      header: "Address",
      enableSorting: false,
      cell: ({ row }) => (
        <Text truncate maxW="200px">
          {row.getValue("address") || "-"}
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
          <EditCustomer customer={row.original} />
          <DeleteCustomer id={row.original.id} />
        </ActionsMenu>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
  ]

  const { table } = useDrfTable<CustomerPublic>({
    data: data?.results || [],
    columns,
    totalCount: data?.count || 0,
    initialColumnVisibility: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      address: false,
      created_at: false,
      updated_at: false,
    },
    onSortingChange: (ordering) => {
      setOrdering(ordering)
    },
  })

  const items = data?.results ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingCustomers />
  }

  if (items.length === 0 && !search?.length) {
    return (
      <EmptyData
        action={<AddCustomer />}
        title="You don't have any customer yet"
        description="Add a new customer to get started"
      />
    )
  }

  return (
    <Container maxW="full">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <PageHeader
          title="Customer management"
          description="Manage your customers and their details"
        />
        <AddCustomer />
      </Flex>
      <Flex justifyContent="space-between" alignItems="end" mb={4}>
        <Heading size="lg">
          {search?.length ? "Found" : "All"} Customers{" "}
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
                <SortableHeader<CustomerPublic>
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
          setSize(pageSize)
        }}
        onPageChange={(page) => {
          setPage(page)
        }}
      />
    </Container>
  )
}
