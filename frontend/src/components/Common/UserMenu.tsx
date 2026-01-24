import { Avatar, Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FiLogOut, FiUser } from "react-icons/fi";
import { Tooltip } from "@/components/ui/tooltip";

import useAuth from "@/hooks/useAuth";
import { useNav } from "@/providers/NavbarProvider";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

const UserMenu = () => {
	const { user, logout } = useAuth();
	const { isFolded, width } = useNav();

	return (
		<Flex>
			<MenuRoot positioning={{ placement: "bottom-end" }}>
				<MenuTrigger asChild>
					<Flex
						w="100%"
						gap={4}
						px={4}
						py={2}
						alignItems="center"
						fontSize="sm"
						cursor="pointer"
						minW={width}
						maxW={width}
						overflow="hidden"
						_hover={{ bg: "gray.subtle" }}
						transition="min-width 0.25s ease, max-width 0.25s ease"
					>
						<HStack>
							<Avatar.Root size="xs">
								<Tooltip
									content={user?.full_name || "User"}
									positioning={{ placement: "top" }}
									disabled={!isFolded}
								>
									<Avatar.Fallback name={user?.full_name || "User"} />
								</Tooltip>
							</Avatar.Root>

							<Text
								whiteSpace="nowrap"
								color="gray"
								opacity={isFolded ? 0 : 1}
								transform={isFolded ? "translateX(-8px)" : "translateX(0)"}
								transition="opacity 0.2s ease, transform 0.2s ease"
							>
								{user?.full_name || "User"}
							</Text>
						</HStack>
					</Flex>
				</MenuTrigger>
				<MenuContent>
					<Link to="/settings">
						<MenuItem value="profile" gap={2} py={2}>
							<FiUser />
							My Profile
						</MenuItem>
					</Link>

					<MenuItem value="logout" gap={2} py={2} onClick={logout}>
						<FiLogOut />
						Log Out
					</MenuItem>
				</MenuContent>
			</MenuRoot>
		</Flex>
	);
};

export default UserMenu;
