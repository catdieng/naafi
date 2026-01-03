import { Flex, Heading, HStack, Text } from "@chakra-ui/react";
import SearchInput from "@/components/Common/SearchInput";

interface DRFToolbarProps {
	title?: string;
	count?: number;
	search?: string;
	onSearchChange?: (value: string) => void;
	actions?: React.ReactNode;
}

export default function DRFToolbar({
	title,
	count,
	search,
	onSearchChange,
	actions,
}: DRFToolbarProps) {
	return (
		<Flex mb={4} justify="space-between" align="center">
			{title && (
				<Heading size="lg" as="h6">
					{search ? "Found" : "All"} {title}
					{typeof count === "number" && (
						<Text as="span" color="gray.500">
							({count})
						</Text>
					)}
				</Heading>
			)}

			<HStack gap={2}>
				{onSearchChange && (
					<SearchInput value={search ?? ""} onSearch={onSearchChange} />
				)}
				{actions}
			</HStack>
		</Flex>
	);
}
