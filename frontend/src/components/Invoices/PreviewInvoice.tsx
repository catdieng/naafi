import {
	Box,
	Flex,
	Heading,
	HStack,
	Separator,
	Table,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useFormContext } from "react-hook-form";
import {
	CustomersService,
	type InvoiceCreate,
	ItemsService,
	SettingsService,
} from "@/client";
import InvoiceTotals from "./InvoiceTotals";

const PreviewInvoice = () => {
	const { watch } = useFormContext<InvoiceCreate>();

	const { data } = useQuery({
		queryKey: ["settings", "company"],
		queryFn: () => SettingsService.readSettings({ domain: "company" }),
	});

	const settings = (data ?? {}) as any;

	const invoiceNumber = watch("invoice_number");
	const items = watch("items");
	const customerId = watch("customer_id");
	const issueDate = watch("issue_date");
	const dueDate = watch("due_date");

	const { data: customer } = useQuery({
		queryKey: ["customer", { customerId }],
		queryFn: () => CustomersService.readCustomer({ id: String(customerId) }),
		enabled: !!customerId,
	});

	const { data: services } = useQuery({
		queryKey: ["itemsAll"],
		queryFn: ItemsService.readItemsAll,
	});

	const calculateTotal = (quantity: string, unitPrice: string) => {
		const qty = parseFloat(quantity || "0");
		const price = parseFloat(unitPrice || "0");
		return (qty * price).toFixed(2) || 0;
	};

	return (
		<Box
			h="100%"
			display="flex"
			flexDirection="column"
			backgroundColor="gray.100"
		>
			<Box p={4} backgroundColor="white" borderTopRadius="md">
				<Heading>Preview</Heading>
			</Box>
			<Box p={4} flex="1" paddingX={8} overflowY="auto" scrollBehavior="smooth">
				<Box backgroundColor="white" p={4} borderRadius="md" borderWidth="1px">
					<Box height="60px">
						<Heading size="xl">Invoice</Heading>
						{invoiceNumber && (
							<Box mb={4}>
								<HStack>
									<Text textStyle="md" color="gray.400">
										Invoice Number:
									</Text>
									<Text fontWeight="bold">#{invoiceNumber}</Text>
								</HStack>
							</Box>
						)}
					</Box>
					<Separator />
					<Flex py={4} width="100%" alignItems="start">
						{settings && (
							<Box w="50%" my={4} gap={2}>
								<Heading fontWeight="normal" size="sm" color="gray.400">
									From :
								</Heading>
								<Box>
									<Box py={1}>
										<Text fontWeight="bold" textStyle="sm">
											{settings?.name}
										</Text>
									</Box>

									<Box py={1}>
										<Text color="gray.400">{settings?.address?.street}</Text>
										<Text color="gray.400">
											{settings?.address?.city}, {settings?.address?.zip}
										</Text>
									</Box>
								</Box>
							</Box>
						)}
						{customerId && customer && (
							<Box w="50%" my={4} gap={2}>
								<Heading fontWeight="normal" size="sm" color="gray.400">
									To:
								</Heading>
								<Box>
									<Box py={1}>
										<Text fontWeight="bold" textStyle="sm">
											{customer?.full_name}
										</Text>
									</Box>
									<Box py={1}>
										<Text color="gray.400">{customer?.address}</Text>
									</Box>
								</Box>
							</Box>
						)}
					</Flex>

					<HStack py={4} justifyContent="space-between">
						{issueDate && (
							<Box w="50%" py={4}>
								<Heading fontWeight="normal" size="sm" color="gray.400">
									Issued Date:
								</Heading>
								{issueDate && (
									<Box py={1}>
										<Text fontWeight="semibold">
											{format(parseISO(issueDate), "MM/dd/yyyy")}
										</Text>
									</Box>
								)}
							</Box>
						)}
						{dueDate && (
							<Box w="50%" py={4}>
								<Heading fontWeight="normal" size="sm" color="grey">
									Due Date:
								</Heading>
								{dueDate && (
									<Box py={1}>
										<Text fontWeight="semibold">
											{format(parseISO(dueDate), "MM/dd/yyyy")}
										</Text>
									</Box>
								)}
							</Box>
						)}
					</HStack>
					<Separator py={4} />

					<Table.Root size="sm" variant="outline" rounded="md">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>Service</Table.ColumnHeader>
								<Table.ColumnHeader>Quantity</Table.ColumnHeader>
								<Table.ColumnHeader>Unit Price</Table.ColumnHeader>
								<Table.ColumnHeader>Sub Total</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{items?.map((item) => {
								const service = services?.results.find(
									(s) => s.id === Number(item.service_id),
								);
								const total = calculateTotal(
									item.quantity,
									String(service?.price ?? "0"),
								);

								return (
									<Table.Row key={item.service_id}>
										<Table.Cell>{service?.name}</Table.Cell>
										<Table.Cell>{item.quantity}</Table.Cell>
										<Table.Cell>{item.unit_price}</Table.Cell>
										<Table.Cell>{total}</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Root>
					<Box py={8}>
						<InvoiceTotals />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default PreviewInvoice;
