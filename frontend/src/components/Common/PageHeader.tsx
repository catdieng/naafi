import { Box, Flex, Heading } from "@chakra-ui/react";
import { ColorModeButton } from "../ui/color-mode";

interface PageHeaderProps {
	title: string;
	description?: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
	return (
		<Flex
			my={2}
			direction="row"
			gap={2}
			justify="space-between"
			align="center"
			w="100%"
		>
			<Heading size="xl" fontWeight="bold">
				{title}
			</Heading>
			<Box ml="auto">
				<ColorModeButton />
			</Box>
		</Flex>
	);
};

export default PageHeader;
