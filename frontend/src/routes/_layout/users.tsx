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
import { z } from "zod"
import { type UserPublic, UsersService } from "@/client"
import { ActionsMenu } from "@/components/Common/ActionsMenu"
import PageHeader from "@/components/Common/PageHeader"
import Paginator from "@/components/Common/Paginator"
import SearchInput from "@/components/Common/SearchInput"
import SortableHeader from "@/components/Common/SortableHeader"
import PendingUsers from "@/components/Pending/PendingUsers"
import AddUser from "@/components/Users/AddUser"
import DeleteUser from "@/components/Users/DeleteUser"
import EditUser from "@/components/Users/EditUser"
import { useDrfTable } from "@/hooks/useDrfTable"

const usersSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(10),
  search: z.string().optional(),
})

function getUsersQueryOptions({
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
    queryFn: () => UsersService.readUsers({ ordering, page, size, search }),
    queryKey: ["users", { ordering, page, size, search }],
  }
}

export const Route = createFileRoute("/_layout/users")({
  component: Users,
  validateSearch: (search) => usersSearchSchema.parse(search),
})

function Users() {
  // const queryClient = useQueryClient()
  // const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
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

  const { table } = useDrfTable<UserPublic>({
    data: data?.results || [],
    columns,
    totalCount: data?.count || 0,
    onSortingChange: (ordering) => {
      setOrdering(ordering)
    },
  })

  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingUsers />
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
      <Flex justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Heading size="lg">
          {search?.length ? "Found" : "All"} Users{" "}
          <Text display="inline" color="grey">
            ({count})
          </Text>
        </Heading>
        <HStack>
          <SearchInput value={search} onSearch={setSearch} />
        </HStack>
      </Flex>
      <Table.Root variant="outline" size={{ base: "md" }} rounded="sm">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <SortableHeader<UserPublic>
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
