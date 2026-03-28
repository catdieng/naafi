import {
	Box,
	Flex,
	Icon,
	Menu,
	Portal,
	Separator,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import { FaBuilding, FaCar, FaFileInvoice } from "react-icons/fa";
import {
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
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import type { UserPublic } from "@/client";
import SidebarItem from "@/components/Common/SidebarItem";
import { useNav } from "@/providers/NavbarProvider";
import { useColorModeValue } from "../ui/color-mode";
import UserMenu from "./UserMenu";

const items = [{ icon: FiHome, title: "Dashboard", path: "/dashboard" }];

interface SidebarItemsProps {
	onClose?: () => void;
}

interface Item {
	icon: IconType;
	title: string;
	path: string;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
	const { isFolded, toggle, width } = useNav();
	const queryClient = useQueryClient();
	const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

	const textColor = useColorModeValue("gray.900", "gray.100");

	const finalItems: Item[] = currentUser?.tenant_id
		? [
				...items,
				{ icon: FiCalendar, title: "Calendar", path: "/calendar" },
				{ icon: FiUsers, title: "Customers", path: "/customers" },
				{ icon: FiBox, title: "Items", path: "/items" },
				{ icon: FiFileText, title: "Invoices", path: "/invoices/" },
				{ icon: FiDollarSign, title: "Expenses", path: "/expenses" },
				{ icon: FiGrid, title: "Categories", path: "/categories" },
			]
		: items;

	const listItems = finalItems.map(({ icon, title, path }) => (
		<RouterLink key={title} to={path} onClick={onClose}>
			<SidebarItem icon={icon} label={title} isFolded={isFolded} />
		</RouterLink>
	));

	const collapseItem = () => (
		<SidebarItem
			icon={isFolded ? RiSidebarUnfoldLine : RiSidebarFoldLine}
			label="Collapse sidebar"
			isFolded={isFolded}
			onClick={toggle}
		/>
	);

	const settingItems: Item[] = [
		{ icon: FaFileInvoice, title: "Billing", path: "/settings/billing" },
		{ icon: FaBuilding, title: "Organization", path: "/settings/organization" },
		{ icon: FiDollarSign, title: "Taxes", path: "/settings/taxes" },
		{ icon: FaCar, title: "Vehicle Brands", path: "/settings/vehicles-brands" },
		{ icon: FiUsers, title: "Users", path: "/settings/users" },
	];

	const settingListItems = settingItems.map(({ icon, path, title }) => (
		<Menu.Item key={path} asChild value={title}>
			<RouterLink to={path} onClick={onClose}>
				<SidebarItem px={0} py={0} icon={icon} label={title} isFolded={false} />
			</RouterLink>
		</Menu.Item>
	));

	return (
		<Stack
			justify="space-between"
			style={{ height: "calc(100vh - 70px)" }}
			pt={4}
		>
			<Flex direction="column">{listItems}</Flex>
			<Flex direction="column">
				{collapseItem()}
				<Menu.Root positioning={{ placement: "right-start" }}>
					<Menu.Trigger asChild>
						<Flex
							gap={4}
							px={6}
							py={2}
							_hover={{ background: "gray.subtle" }}
							alignItems="center"
							fontSize="sm"
							minW={width}
							maxW={width}
						>
							<Box alignItems="center" py={1}>
								<Icon
									as={FiSettings}
									alignSelf="center"
									size="sm"
									fontWeight="bold"
									color={textColor}
								></Icon>
							</Box>

							{!isFolded && (
								<Text
									ml={1}
									fontWeight="medium"
									fontSize="sm"
									color={textColor}
								>
									Settings
								</Text>
							)}
						</Flex>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>{settingListItems}</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu.Root>
				<Separator />
				<Box>
					<UserMenu />
				</Box>
			</Flex>
		</Stack>
	);
};

export default SidebarItems;
