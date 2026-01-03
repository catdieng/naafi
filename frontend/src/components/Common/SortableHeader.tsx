import {
	HStack,
	Table,
	type TableColumnHeaderProps,
	Text,
} from "@chakra-ui/react";
import { flexRender, type Header } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SortableHeaderProps<TData> extends TableColumnHeaderProps {
	header: Header<TData, unknown>;
	children?: ReactNode;
	orderingKey?: string; // DRF-specific ordering key (might differ from accessorKey)
}

function SortableHeader<TData>({
	header,
	children,
	orderingKey,
	...thProps
}: SortableHeaderProps<TData>) {
	const canSort = header.column.getCanSort();
	const isSorted = header.column.getIsSorted();

	return (
		<>
			{header.column.id === "actions" ? (
				<Table.ColumnHeader textAlign="end">
					<Text>
						{flexRender(header.column.columnDef.header, header.getContext())}
					</Text>
				</Table.ColumnHeader>
			) : (
				<Table.ColumnHeader
					w="sm"
					onClick={header.column.getToggleSortingHandler()}
					cursor={canSort ? "pointer" : "default"}
					userSelect="none"
					_hover={{
						bg: canSort ? "gray.100" : "transparent",
					}}
					transition="background 0.2s"
					{...thProps}
				>
					<HStack>
						{children || (
							<Text>
								{flexRender(
									header.column.columnDef.header,
									header.getContext(),
								)}
							</Text>
						)}
						{canSort && (
							<>
								{isSorted === "asc" && <FiChevronUp size="8px" />}
								{isSorted === "desc" && <FiChevronDown size="8px" />}
								{!isSorted && <FiChevronDown size="8px" />}
							</>
						)}
					</HStack>
				</Table.ColumnHeader>
			)}
		</>
	);
}

export default SortableHeader;
