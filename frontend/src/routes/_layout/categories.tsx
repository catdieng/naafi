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
import { useCallback } from "react"
import {
  CategoriesSearchSchema,
  CategoriesService,
  type CategoryPublic,
} from "@/client"
import AddCategory from "@/components/Categories/AddCategory"
import DeleteCategory from "@/components/Categories/DeleteCategory"
import EditCategory from "@/components/Categories/EditCategory"
import { ActionsMenu } from "@/components/Common/ActionsMenu"
import ColumnVisibilityControl from "@/components/Common/ColumnVisibilityControl"
import EmptyData from "@/components/Common/EmptyData"
import PageHeader from "@/components/Common/PageHeader"
import Paginator from "@/components/Common/Paginator"
import SearchInput from "@/components/Common/SearchInput"
import SortableHeader from "@/components/Common/SortableHeader"
import PendingItems from "@/components/Pending/PendingItems"
import { useDrfTable } from "@/hooks/useDrfTable"

export const Route = createFileRoute("/_layout/categories")({
  component: Categories,
  validateSearch: (search) => CategoriesSearchSchema.parse(search),
})

function getCategoriesQueryOptions({
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
      CategoriesService.readCategories({ ordering, page, size, search }),
    queryKey: ["categories", { ordering, page, size, search }],
  }
}

function Categories() {
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
    ...getCategoriesQueryOptions({ ordering, page, size, search }),
    placeholderData: (prevData) => prevData,
  })

  const columns: ColumnDef<CategoryPublic>[] = [
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
      accessorKey: "type",
      header: "Type",
      enableSorting: true,
      // size: 200,
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
      id: "actions",
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
  ]

  const { table } = useDrfTable<CategoryPublic>({
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
    return <PendingItems />
  }

  if (items.length === 0 && !search.length) {
    return (
      <EmptyData
        action={<AddCategory />}
        title="You don't have any category yet"
        description="Add a new category to get started"
      />
    )
  }
  return (
    <Container maxW="full">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <PageHeader
          title="Category management"
          description="Manage your categories and their details"
        />
        <AddCategory />
      </Flex>
      <Flex justifyContent="space-between" alignItems="end" mb={4}>
        <Heading size="lg">
          {search?.length ? "Found" : "All"} Categories{" "}
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
                <SortableHeader<CategoryPublic>
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
