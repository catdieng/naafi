import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import type { UserPublic } from "@/client";
import useAuth from "@/hooks/useAuth";
import { useNav } from "../../providers/NavbarProvider";
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerCloseTrigger,
	DrawerContent,
	DrawerRoot,
	DrawerTrigger,
} from "../ui/drawer";
import Navbar from "./Navbar";
import SidebarItems from "./SidebarItems";

const Sidebar = () => {
	const { width } = useNav();
	const queryClient = useQueryClient();
	const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
	const { logout } = useAuth();
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Mobile */}
			<DrawerRoot
				placement="start"
				open={open}
				onOpenChange={(e) => setOpen(e.open)}
			>
				<DrawerBackdrop />
				<DrawerTrigger asChild>
					<IconButton
						variant="ghost"
						color="inherit"
						display={{ base: "flex", md: "none" }}
						aria-label="Open Menu"
						position="absolute"
						zIndex="100"
						m={4}
					>
						<FaBars />
					</IconButton>
				</DrawerTrigger>
				<DrawerContent maxW="xs">
					<DrawerCloseTrigger />
					<DrawerBody backgroundColor="fafafa">
						<Flex flexDir="column" justify="space-between">
							<Box>
								<SidebarItems onClose={() => setOpen(false)} />
								<Flex
									as="button"
									onClick={() => {
										logout();
									}}
									alignItems="center"
									gap={4}
									px={4}
									py={2}
								>
									<FiLogOut />
									<Text>Log Out</Text>
								</Flex>
							</Box>
							{currentUser?.email && (
								<Text fontSize="sm" p={2} truncate maxW="sm">
									Logged in as: {currentUser.email}
								</Text>
							)}
						</Flex>
					</DrawerBody>
					<DrawerCloseTrigger />
				</DrawerContent>
			</DrawerRoot>

			{/* Desktop */}

			<Box
				display={{ base: "none", md: "flex" }}
				position="sticky"
				bg="bg.subtle"
				top={0}
				minW={width}
				maxW={width}
				h="100vh"
				overflow="hidden"
				transition="min-width 0.25s ease, max-width 0.25s ease"
			>
				<Box w="100%">
					<Navbar />
					<SidebarItems />
				</Box>
			</Box>
		</>
	);
};

export default Sidebar;
