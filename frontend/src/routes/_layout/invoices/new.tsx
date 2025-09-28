import { createFileRoute, useNavigate } from "@tanstack/react-router";

import FormInvoice from "@/components/Invoices/FormInvoice";

export const Route = createFileRoute("/_layout/invoices/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	return (
		<FormInvoice
			mode="new"
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
	// const [showPreview, setShowPreview] = useState(false);
	// const queryClient = useQueryClient();
	// const { showSuccessToast } = useCustomToast();
	// const navigate = useNavigate();

	// const methods = useForm<InvoiceCreate>({
	// 	criteriaMode: "all",
	// 	mode: "onBlur",
	// 	resolver: zodResolver(InvoiceCreateSchema),
	// 	defaultValues: {
	// 		items: [],
	// 	},
	// });

	// const mutation = useMutation({
	// 	mutationFn: (data: InvoiceCreate) =>
	// 		InvoicesService.createInvoice({ requestBody: data }),
	// 	onSuccess: () => {
	// 		showSuccessToast("Invoice created successfully.");
	// 		methods.reset();
	// 	},
	// 	onError: (err: ApiError) => {
	// 		handleError(err);
	// 	},
	// 	onSettled: () => {
	// 		queryClient.invalidateQueries({ queryKey: ["invoices"] });
	// 	},
	// });

	// const onSubmit: SubmitHandler<InvoiceCreate> = (data) => {
	// 	mutation.mutate(data);
	// };

	// return (
	// 	<Container maxW="full" h="100vh" display="flex" flexDirection="column">
	// 		<Flex justifyContent="space-between" alignItems="center" mb={4}>
	// 			<PageHeader title="New invoice" />
	// 			<ButtonGroup size="sm">
	// 				<Button
	// 					variant="outline"
	// 					onClick={() =>
	// 						navigate({
	// 							to: "../",
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
	// 							<HStack justifyContent="space-between">
	// 								<Heading>Invoice Detail</Heading>
	// 								<Switch.Root
	// 									size="xs"
	// 									checked={showPreview}
	// 									onCheckedChange={(e) => setShowPreview(e.checked)}
	// 								>
	// 									<Switch.HiddenInput />
	// 									<Switch.Control />
	// 									<Switch.Label>Preview</Switch.Label>
	// 								</Switch.Root>
	// 							</HStack>
	// 							<Box gap={2}>
	// 								<EditInvoiceInfo />
	// 								<SelectCustomer
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
	// 	</Container>
	// );
}
