import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { useState } from "react"

interface UseDrfTableOptions<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  totalCount: number
  onSortingChange?: (ordering: string) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  initialColumnVisibility?: VisibilityState
}

export function useDrfTable<TData>({
  data,
  columns,
  totalCount,
  onSortingChange,
  onColumnVisibilityChange,
  initialColumnVisibility = {},
}: UseDrfTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  )

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater
      setSorting(newSorting)

      // Convert to DRF ordering string
      if (onSortingChange) {
        const ordering = newSorting
          .map((sort) => (sort.desc ? "-" : "") + sort.id)
          .join(",")
        onSortingChange(ordering || "")
      }
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater
      setColumnVisibility(newVisibility)

      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(newVisibility)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    rowCount: totalCount,
  })

  return { table, sorting }
}
