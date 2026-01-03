import {
	ButtonGroup,
	Flex,
	HStack,
	IconButton,
	NativeSelect,
	Pagination,
	PaginationRoot,
	Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginatorProps {
	count: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	page: number;
	size: number;
	steps?: number[];
}

const Paginator = ({
	count,
	onPageChange,
	onPageSizeChange,
	page,
	size,
	steps = [10, 20, 50, 100],
}: PaginatorProps) => {
	return (
		<Flex justifyContent="space-between" mt={4}>
			<HStack>
				<Text>Items per page</Text>
				<NativeSelect.Root size="sm" width="100px">
					<NativeSelect.Field
						placeholder="Select"
						value={size}
						onChange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
					>
						{steps.map((step) => (
							<option key={step} value={step}>
								{step}
							</option>
						))}
					</NativeSelect.Field>
					<NativeSelect.Indicator />
				</NativeSelect.Root>
			</HStack>
			<PaginationRoot
				count={count}
				pageSize={size}
				page={page}
				onPageSizeChange={({ pageSize }) => {
					onPageSizeChange(pageSize);
				}}
				onPageChange={({ page }) => {
					onPageChange(page);
				}}
			>
				<ButtonGroup variant="ghost" size="sm" w="full">
					<Pagination.PageText format="long" flex="1" />
					<Pagination.PrevTrigger asChild>
						<IconButton>
							<LuChevronLeft />
						</IconButton>
					</Pagination.PrevTrigger>
					<Pagination.NextTrigger asChild>
						<IconButton>
							<LuChevronRight />
						</IconButton>
					</Pagination.NextTrigger>
				</ButtonGroup>
			</PaginationRoot>
		</Flex>
	);
};

export default Paginator;
