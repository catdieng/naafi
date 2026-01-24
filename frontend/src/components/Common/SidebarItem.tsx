import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { Tooltip } from "../ui/tooltip";

interface SidebarItemProps {
	px?: number;
	py?: number;
	icon: IconType;
	label: string;
	onClick?: () => void;
	isFolded?: boolean;
	children?: React.ReactNode;
}

export default function SidebarItem({
	icon,
	label,
	onClick,
	isFolded,
	children,
	px = 6,
	py = 2,
}: SidebarItemProps) {
	return (
		<Flex
			as="button"
			w="100%"
			gap={4}
			px={px}
			py={py}
			alignItems="center"
			verticalAlign="middle"
			cursor="pointer"
			fontSize="sm"
			onClick={onClick}
			_hover={{ bg: "gray.subtle" }}
		>
			<Tooltip content={label} disabled={!isFolded}>
				<Box alignItems="center" py={1}>
					<Icon as={icon} size="sm" color="gray.400" />
				</Box>
			</Tooltip>

			<Text
				fontWeight="medium"
				fontSize="sm"
				color="#585858"
				whiteSpace="nowrap"
				opacity={isFolded ? 0 : 1}
				transform={isFolded ? "translateX(-8px)" : "translateX(0)"}
				transition="opacity 0.2s ease, transform 0.2s ease"
			>
				{label}
			</Text>
			{children}
		</Flex>
	);
}
