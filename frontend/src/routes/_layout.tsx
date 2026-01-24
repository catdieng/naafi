import { Flex } from "@chakra-ui/react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// import Navbar from "@/components/Common/Navbar";
import Sidebar from "@/components/Common/Sidebar";
import { isLoggedIn } from "@/hooks/useAuth";
import { NavbarProvider } from "@/providers/NavbarProvider";

export const Route = createFileRoute("/_layout")({
	component: Layout,
	beforeLoad: async () => {
		if (!isLoggedIn()) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

function Layout() {
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

export default Layout;
