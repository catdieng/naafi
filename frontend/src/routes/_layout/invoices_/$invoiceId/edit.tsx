import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Container,
	Flex,
	Heading,
	HStack,
	Separator,
	Show,
	Spinner,
	Switch,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import {
	type ApiError,
	InvoicesService,
	type InvoiceUpdate,
	InvoiceUpdateSchema,
} from "@/client";
import PageHeader from "@/components/Common/PageHeader";
import { SelectCustomer } from "@/components/Common/SelectCustomer";
import EditInvoiceInfo from "@/components/Invoices/EditInvoiceInfo";
import EditInvoiceItem from "@/components/Invoices/EditInvoiceItem";
import FormInvoice from "@/components/Invoices/FormInvoice";
import InvoiceTotals from "@/components/Invoices/InvoiceTotals";
import PreviewInvoice from "@/components/Invoices/PreviewInvoice";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

export const Route = createFileRoute("/_layout/invoices_/$invoiceId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { invoiceId } = Route.useParams();

	return (
		<FormInvoice
			mode="edit"
			invoiceId={invoiceId}
			onCancel={() =>
				navigate({
					to: "/invoices",
				})
			}
			onSuccess={() =>
				navigate({
					to: "/invoices",
				})
			}
		/>
	);
	// const { invoiceId } = Route.useParams();
	// const [showPreview, setShowPreview] = useState(true);
	// const queryClient = useQueryClient();
	// const { showSuccessToast } = useCustomToast();
	// const navigate = useNavigate();

	// const { data: invoice, isLoading } = useQuery({
	// 	queryFn: () => InvoicesService.readInvoice({ id: invoiceId }),
	// 	queryKey: ["invoice", invoiceId],
	// 	enabled: !!invoiceId,
	// });

	// const methods = useForm<InvoiceUpdate>({
	// 	criteriaMode: "all",
	// 	mode: "onBlur",
	// 	resolver: zodResolver(InvoiceUpdateSchema),
	// 	defaultValues: {
	// 		items: [],
	// 	},
	// });

	// const mutation = useMutation({
	// 	mutationFn: (data: InvoiceUpdate) => {
	// 		if (!invoice) {
	// 			throw new Error("No invoice loaded");
	// 		}
	// 		return InvoicesService.updateInvoice({
	// 			id: invoice.id,
	// 			requestBody: data,
	// 		});
	// 	},
	// 	onSuccess: () => {
	// 		showSuccessToast("Invoice updated successfully.");
	// 		methods.reset();
	// 	},
	// 	onError: (err: ApiError) => {
	// 		handleError(err);
	// 	},
	// 	onSettled: () => {
	// 		queryClient.invalidateQueries({ queryKey: ["invoices"] });
	// 	},
	// });

	// const onSubmit: SubmitHandler<InvoiceUpdate> = (data) => {
	// 	mutation.mutate(data);
	// };

	// useEffect(() => {
	// 	if (invoice) {
	// 		methods.setValue("customer_id", String(invoice.customer.id));
	// 		methods.setValue("invoice_number", invoice.invoice_number);
	// 		methods.setValue("issue_date", invoice.issue_date);
	// 		methods.setValue("due_date", invoice.issue_date);
	// 		methods.setValue(
	// 			"items",
	// 			invoice?.items?.map((el) => ({
	// 				service_id: el.service_id,
	// 				quantity: el.quantity,
	// 				unit_price: el.unit_price,
	// 			})),
	// 		);
	// 	}
	// }, [invoice]);

	// return (
	// 	<Container maxW="full" h="100vh" display="flex" flexDirection="column">
	// 		<Flex justifyContent="space-between" alignItems="center" mb={4}>
	// 			<PageHeader title="Edit invoice" />
	// 			<ButtonGroup size="sm">
	// 				<Button
	// 					variant="outline"
	// 					onClick={() =>
	// 						navigate({
	// 							to: "/invoices",
	// 						})
	// 					}
	// 				>
	// 					Cancel
	// 				</Button>
	// 				<Button
	// 					onClick={() => {
	// 						methods.handleSubmit(onSubmit)();
	// 					}}
	// 				>
	// 					Save
	// 				</Button>
	// 			</ButtonGroup>
	// 		</Flex>
	// 		<Flex>
	// 			<FormProvider {...methods}>
	// 				<form
	// 					style={{ flex: 1, display: "flex" }}
	// 					onSubmit={methods.handleSubmit(onSubmit)}
	// 				>
	// 					<Flex gap={4} w="100%" h="100%">
	// 						<Box
	// 							borderRadius="md"
	// 							w={showPreview ? "50%" : "100%"}
	// 							borderWidth="1px"
	// 							padding={4}
	// 							overflowY="auto"
	// 							scrollBehavior="smooth"
	// 							h="calc(100vh - 180px)"
	// 						>
	// 							<HStack pb={4} justifyContent="space-between">
	// 								<Heading>Invoice Detail</Heading>
	// 								<Switch.Root
	// 									size="xs"
	// 									checked={showPreview}
	// 									onCheckedChange={(e) => setShowPreview(e.checked)}
	// 								>
	// 									<Switch.HiddenInput />
	// 									<Switch.Control />
	// 									<Switch.Label>Show preview</Switch.Label>
	// 								</Switch.Root>
	// 							</HStack>
	// 							<Separator />
	// 							<Box py={4} gap={2}>
	// 								<EditInvoiceInfo />
	// 								<SelectCustomer
	// 									customer={invoice?.customer}
	// 									control={methods.control}
	// 									label="Customer"
	// 									name="customer_id"
	// 								/>
	// 								<EditInvoiceItem />
	// 								<InvoiceTotals />
	// 							</Box>
	// 						</Box>
	// 						<Show when={showPreview}>
	// 							<Box
	// 								borderRadius="md"
	// 								w="50%"
	// 								borderWidth="1px"
	// 								scrollBehavior="smooth"
	// 								h="calc(100vh - 180px)"
	// 							>
	// 								<PreviewInvoice />
	// 							</Box>
	// 						</Show>
	// 					</Flex>
	// 				</form>
	// 			</FormProvider>
	// 		</Flex>
	// 		{isLoading && (
	// 			<Box pos="absolute" inset="0" bg="bg/80">
	// 				<Center h="full">
	// 					<Spinner color="teal.500" />
	// 				</Center>
	// 			</Box>
	// 		)}
	// 	</Container>
	// );
}
