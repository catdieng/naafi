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
}
