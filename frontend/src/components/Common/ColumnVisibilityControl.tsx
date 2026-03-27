import { Menu } from "@chakra-ui/react";
import type { Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiColumns } from "react-icons/fi";
import { Button } from "../ui/button";

function ColumnVisibilityControl<TData>({ table }: { table: Table<TData> }) {
	const allColumns = useMemo(() => table.getAllLeafColumns(), [table]);

	return (
		<Menu.Root>
			<Menu.Trigger asChild>
				<Button size="sm" variant="outline">
					<FiColumns /> Columns
				</Button>
			</Menu.Trigger>
			<Menu.Positioner>
				<Menu.Content>
					<Menu.ItemGroup>
						<Menu.ItemGroupLabel>Columns</Menu.ItemGroupLabel>
						{allColumns.map((column) => {
							if (column.id === "actions") return null;

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
							);
						})}
					</Menu.ItemGroup>
				</Menu.Content>
			</Menu.Positioner>
		</Menu.Root>
	);
}

export default ColumnVisibilityControl;
