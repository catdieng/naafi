import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { useColorModeValue } from "../ui/color-mode";
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
	const textColor = useColorModeValue("gray.9	00", "gray.100");
	const hoverColor = useColorModeValue("gray.100", "gray.900");
	return (
		<Flex
			as="button"
			w="100%"
			gap={4}
			px={px}
			py={py}
			alignContent="center"
			alignItems="center"
			verticalAlign="middle"
			cursor="pointer"
			fontSize="sm"
			onClick={onClick}
			_hover={{ bg: hoverColor }}
		>
			<Tooltip content={label} disabled={!isFolded}>
				<Box alignItems="center" py={1}>
					<Icon as={icon} size="sm" color={textColor} />
				</Box>
			</Tooltip>

			<Text
				fontWeight="medium"
				fontSize="sm"
				color={textColor}
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
