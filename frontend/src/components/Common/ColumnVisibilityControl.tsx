import { Button, Menu, Portal } from "@chakra-ui/react"
import type { Table } from "@tanstack/react-table"
import { useMemo } from "react"
import { FiFilter } from "react-icons/fi"

function ColumnVisibilityControl<TData>({ table }: { table: Table<TData> }) {
  const allColumns = useMemo(() => table.getAllLeafColumns(), [table])

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="sm" variant="outline" colorPalette="gray">
          <FiFilter /> Filters
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Columns</Menu.ItemGroupLabel>
              {allColumns.map((column) => {
                // Skip the actions column
                if (column.id === "actions") return null

                return (
                  <Menu.CheckboxItem
                    key={String(column.columnDef.header)}
                    value={column.id}
                    disabled={!column.getCanHide()}
                    checked={column.getIsVisible()}
                    onClick={() => column.toggleVisibility()}
                  >
                    {String(column.columnDef.header)}
                    <Menu.ItemIndicator />
                  </Menu.CheckboxItem>
                )
              })}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default ColumnVisibilityControl
