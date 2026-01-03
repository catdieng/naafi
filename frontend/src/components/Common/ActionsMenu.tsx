import { Flex, IconButton } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu";

interface ActionsMenuProps {
	children: ReactNode;
}

export const ActionsMenu = ({ children }: ActionsMenuProps) => {
	return (
		<Flex justify="end">
			<MenuRoot size="md">
				<MenuTrigger asChild>
					<IconButton variant="ghost" color="inherit" size="2xs">
						<BsThreeDotsVertical />
					</IconButton>
				</MenuTrigger>
				<MenuContent textAlign="end">{children}</MenuContent>
			</MenuRoot>
		</Flex>
	);
};
