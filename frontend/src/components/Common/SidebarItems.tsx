import { Box, Collapsible, Flex, Icon, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import { FaBuilding, FaCar, FaFileInvoice } from "react-icons/fa";
import {
	FiActivity,
	FiBook,
	FiBox,
	FiCalendar,
	FiDollarSign,
	FiFileText,
	FiGrid,
	FiHome,
	FiSettings,
	FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import type { UserPublic } from "@/client";

const items = [
	{ icon: FiHome, title: "Dashboard", path: "/" },
	// { icon: FiSettings, title: "User Settings", path: "/settings" },
];

interface SidebarItemsProps {
	onClose?: () => void;
}

interface Item {
	icon: IconType;
	title: string;
	path: string;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
	const queryClient = useQueryClient();
	const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

	const finalItems: Item[] = currentUser?.tenant_id
		? [
				...items,
				{ icon: FiActivity, title: "Activity", path: "/activity" },
				{ icon: FiCalendar, title: "Calendar", path: "/calendar" },
				{ icon: FiUsers, title: "Customers", path: "/customers" },
				{ icon: FiBox, title: "Items", path: "/items" },
				{ icon: FiFileText, title: "Invoices", path: "/invoices/" },
				{ icon: FiDollarSign, title: "Expenses", path: "/expenses" },
				{ icon: FiGrid, title: "Categories", path: "/categories" },
				{ icon: FiUsers, title: "Users", path: "/users" },
			]
		: items;

	const listItems = finalItems.map(({ icon, title, path }) => (
		<RouterLink key={title} to={path} onClick={onClose}>
			<Flex
				gap={4}
				px={4}
				py={2}
				_hover={{
					background: "gray.subtle",
				}}
				alignItems="center"
				fontSize="sm"
			>
				<Icon as={icon} alignSelf="center" />
				<Text ml={1} fontWeight="semibold" fontSize="sm" color="#585858">
					{title}
				</Text>
			</Flex>
		</RouterLink>
	));

	const settingItems: Item[] = [
		{ icon: FaFileInvoice, title: "Billing", path: "/settings/billing" },
		{ icon: FaBuilding, title: "Organization", path: "/settings/organization" },
		{ icon: FiDollarSign, title: "Taxes", path: "/settings/taxes" },
		{ icon: FaCar, title: "Vehicle Brands", path: "/settings/vehicles-brands" },
	];

	const settingListItems = settingItems.map(({ icon, title, path }) => (
		<RouterLink key={title} to={path} onClick={onClose}>
			<Flex
				gap={4}
				px={4}
				py={2}
				_hover={{
					background: "gray.subtle",
				}}
				alignItems="center"
				fontSize="sm"
			>
				<Icon as={icon} alignSelf="center" />
				<Text ml={1} fontWeight="semibold" fontSize="sm" color="#585858">
					{title}
				</Text>
			</Flex>
		</RouterLink>
	));

	return (
		<>
			<Text fontSize="xs" px={4} py={2} fontWeight="bold">
				Menu
			</Text>
			<Box>
				{listItems}
				<Collapsible.Root>
					<Collapsible.Trigger>
						<Flex
							gap={4}
							px={4}
							py={2}
							_hover={{
								background: "gray.subtle",
							}}
							alignItems="center"
							fontSize="sm"
							width="xs"
						>
							<Icon alignSelf="center">
								<FiSettings />
							</Icon>
							<Text fontWeight="semibold" fontSize="sm" color="#585858">
								Settings
							</Text>
						</Flex>
					</Collapsible.Trigger>
					<Collapsible.Content width="xs">
						<Box paddingX="8">{settingListItems}</Box>
					</Collapsible.Content>
				</Collapsible.Root>
			</Box>
		</>
	);
};

export default SidebarItems;
