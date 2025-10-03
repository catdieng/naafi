import { createFileRoute, useNavigate } from "@tanstack/react-router";
import FormInvoice from "@/components/Invoices/FormInvoice";

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
}
