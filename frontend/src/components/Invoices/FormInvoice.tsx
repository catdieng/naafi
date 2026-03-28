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
import { useEffect, useEffectEvent, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import {
	type ApiError,
	type InvoiceCreate,
	InvoiceCreateSchema,
	InvoicesService,
	type InvoiceUpdate,
	InvoiceUpdateSchema,
} from "@/client";
import PageHeader from "@/components/Common/PageHeader";
import { SelectCustomer } from "@/components/Common/SelectCustomer";
import EditInvoiceInfo from "@/components/Invoices/EditInvoiceInfo";
import EditInvoiceItem from "@/components/Invoices/EditInvoiceItem";
import InvoiceTotals from "@/components/Invoices/InvoiceTotals";
import PreviewInvoice from "@/components/Invoices/PreviewInvoice";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

interface FormInvoiceProps {
	mode: "new" | "edit";
	invoiceId?: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const FormInvoice = ({
	mode,
	invoiceId,
	onCancel,
	onSuccess,
}: FormInvoiceProps) => {
	const [showPreview, setShowPreview] = useState(mode === "edit");
	const queryClient = useQueryClient();
	const { showSuccessToast } = useCustomToast();

	const { data: invoice, isLoading } = useQuery({
		queryFn: () =>
			invoiceId ? InvoicesService.readInvoice({ id: invoiceId }) : null,
		queryKey: ["invoice", invoiceId],
		enabled: !!invoiceId,
	});

	const methods = useForm<InvoiceCreate | InvoiceUpdate>({
		criteriaMode: "all",
		mode: "onBlur",
		resolver: zodResolver(
			mode === "new" ? InvoiceCreateSchema : InvoiceUpdateSchema,
		),
		defaultValues: { items: [] },
	});

	const hydrateForm = useEffectEvent(() => {
		if (invoice && mode === "edit") {
			methods.setValue("customer_id", String(invoice.customer.id));
			methods.setValue("invoice_number", invoice.invoice_number);
			methods.setValue("issue_date", invoice.issue_date);
			methods.setValue("due_date", invoice.due_date);
			methods.setValue(
				"items",
				invoice.items?.map((el) => ({
					service_id: String(el.service_id),
					quantity: String(el.quantity),
					unit_price: el.unit_price,
				})),
			);
		}
	});

	useEffect(() => {
		hydrateForm();
	}, [invoice, mode]);

	const mutation = useMutation({
		mutationFn: (data: InvoiceCreate | InvoiceUpdate) => {
			if (mode === "new")
				return InvoicesService.createInvoice({
					requestBody: data as InvoiceCreate,
				});
			if (!invoice) throw new Error("No invoice loaded");
			return InvoicesService.updateInvoice({
				id: invoice.id,
				requestBody: data as InvoiceUpdate,
			});
		},
		onSuccess: () => {
			showSuccessToast(
				`Invoice ${mode === "new" ? "created" : "updated"} successfully.`,
			);
			methods.reset();
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
		},
		onError: (err: ApiError) => handleError(err),
	});

	const onSubmit: SubmitHandler<InvoiceCreate | InvoiceUpdate> = (data) =>
		mutation.mutate(data);

	return (
		<Container maxW="full" h="100vh" display="flex" flexDirection="column">
			<Flex justifyContent="space-between" alignItems="center" mb={4}>
				<PageHeader title={mode === "new" ? "New Invoice" : "Edit Invoice"} />
				<ButtonGroup size="sm">
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						loading={mutation.isPending}
						disabled={!methods.formState.isValid}
						onClick={() => {
							methods.handleSubmit(onSubmit)();
						}}
					>
						Save
					</Button>
				</ButtonGroup>
			</Flex>

			<Flex>
				<FormProvider {...methods}>
					<form
						style={{ flex: 1, display: "flex" }}
						onSubmit={methods.handleSubmit(onSubmit)}
					>
						<Flex gap={4} w="100%" h="100%">
							<Box
								borderRadius="md"
								w={showPreview ? "50%" : "100%"}
								borderWidth="1px"
								padding={4}
								overflowY="auto"
								scrollBehavior="smooth"
								h="calc(100vh - 180px)"
							>
								<HStack pb={4} justifyContent="space-between">
									<Heading>Invoice Detail</Heading>
									<Switch.Root
										size="xs"
										checked={showPreview}
										onCheckedChange={(e) => setShowPreview(e.checked)}
									>
										<Switch.HiddenInput />
										<Switch.Control />
										<Switch.Label>
											{mode === "new" ? "Preview" : "Show preview"}
										</Switch.Label>
									</Switch.Root>
								</HStack>
								<Separator />
								<Box py={4} gap={2}>
									<EditInvoiceInfo />
									<SelectCustomer
										customer={invoice?.customer}
										control={methods.control}
										label="Customer"
										name="customer_id"
									/>
									<EditInvoiceItem />
									<InvoiceTotals />
								</Box>
							</Box>
							<Show when={showPreview}>
								<Box
									borderRadius="md"
									w="50%"
									borderWidth="1px"
									scrollBehavior="smooth"
									h="calc(100vh - 180px)"
								>
									<PreviewInvoice />
								</Box>
							</Show>
						</Flex>
					</form>
				</FormProvider>
			</Flex>

			{isLoading && (
				<Box pos="absolute" inset="0" bg="bg/80">
					<Center h="full">
						<Spinner color="teal.500" />
					</Center>
				</Box>
			)}
		</Container>
	);
};

export default FormInvoice;
