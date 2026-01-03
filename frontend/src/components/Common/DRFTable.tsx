import { type ConditionalValue, Table } from "@chakra-ui/react";
import {
	type ColumnDef,
	flexRender,
	type Table as ReactTable,
} from "@tanstack/react-table";
import Pending from "../Pending/Pending";
import Paginator from "./Paginator";
import SortableHeader from "./SortableHeader";

interface DrfTableProps<T> {
	table: ReactTable<T>;
	columns: ColumnDef<T, unknown>[];
	totalCount: number;
	page: number;
	size: number;
	isLoading?: boolean;
	tableSize?: ConditionalValue<"sm" | "md" | "lg" | undefined>;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export default function DrfTable<T>({
	table,
	columns,
	totalCount,
	page,
	size,
	isLoading,
	tableSize = "md",
	onPageChange,
	onPageSizeChange,
}: DrfTableProps<T>) {
	if (isLoading) {
		return <Pending columns={columns.map((c) => String(c.header))} />;
	}

	return (
		<>
			<Table.ScrollArea borderWidth="1px" maxW="full" rounded="md">
				<Table.Root size={tableSize} variant="outline" rounded="md">
					<Table.Header>
						{table.getHeaderGroups().map((hg) => (
							<Table.Row roundedTop={8} key={hg.id}>
								{hg.headers.map((header) => (
									<SortableHeader<T>
										key={header.id}
										header={header}
										orderingKey={header.column.id}
									/>
								))}
							</Table.Row>
						))}
					</Table.Header>

					<Table.Body>
						{table.getRowModel().rows.length === 0 ? (
							<Table.Row>
								<Table.Cell colSpan={columns.length} textAlign="center">
									No results
								</Table.Cell>
							</Table.Row>
						) : (
							table.getRowModel().rows.map((row) => (
								<Table.Row key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<Table.Cell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</Table.Cell>
									))}
								</Table.Row>
							))
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>
			<Paginator
				count={totalCount}
				page={page}
				size={size}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</>
	);
}
