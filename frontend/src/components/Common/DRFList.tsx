import { Box, type ConditionalValue, HStack } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useDrfTable } from "../../hooks/useDrfTable";
import ColumnVisibilityControl from "./ColumnVisibilityControl";
import DRFToolbar from "./DRFToolbar";
import DrfTable from "./DrfTable";

interface DrfListProps<T> {
	title?: string;
	columns: ColumnDef<T, unknown>[];
	data: T[];
	totalCount: number;
	page: number;
	size: number;
	search?: string;
	isLoading?: boolean;
	tableSize?: ConditionalValue<"sm" | "md" | "lg" | undefined>;
	onSearchChange?: (value: string) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onOrderingChange: (ordering: string) => void;
	actions?: React.ReactNode;
	initialColumnVisibility?: Record<string, boolean>;
}

export default function DrfList<T>({
	title,
	columns,
	data,
	totalCount,
	page,
	size,
	search,
	isLoading,
	tableSize,
	onSearchChange,
	onPageChange,
	onPageSizeChange,
	onOrderingChange,
	actions,
	initialColumnVisibility,
}: DrfListProps<T>) {
	const { table } = useDrfTable<T>({
		columns,
		data,
		totalCount,
		initialColumnVisibility,
		onSortingChange: onOrderingChange,
	});

	return (
		<Box>
			<DRFToolbar
				title={title}
				count={totalCount}
				search={search}
				onSearchChange={onSearchChange}
				actions={
					<HStack>
						<ColumnVisibilityControl table={table} />
						{actions}
					</HStack>
				}
			/>
			<DrfTable
				table={table}
				columns={columns}
				totalCount={totalCount}
				page={page}
				size={size}
				tableSize={tableSize}
				isLoading={isLoading}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</Box>
	);
}
