import { Flex } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-router";

import Sidebar from "@/components/Common/Sidebar";
import { NavbarProvider } from "@/providers/NavbarProvider";

export default function AuthenticatedLayout() {
	return (
		<Flex direction="column" h="100vh">
			{/* <Navbar /> */}
			<Flex flex="1" overflow="hidden">
				<NavbarProvider>
					<Sidebar />
				</NavbarProvider>
				<Flex flex="1" direction="column" overflowY="auto">
					<Outlet />
				</Flex>
			</Flex>
		</Flex>
	);
}
