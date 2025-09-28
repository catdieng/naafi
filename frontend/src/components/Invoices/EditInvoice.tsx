import { Button } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { FaEdit } from "react-icons/fa";
import type { InvoicePublic } from "@/client";

interface EditInvoiceProps {
	invoice: InvoicePublic;
}

const EditInvoice = ({ invoice }: EditInvoiceProps) => {
	const navigate = useNavigate();

	return (
		<Button
			value="edit-invoice"
			size="xs"
			variant="ghost"
			colorPalette="gray"
			onClick={() => {
				navigate({ to: `${invoice.id}/edit` });
			}}
		>
			<FaEdit fontSize="16px" />
			Edit Invoice
		</Button>
	);
};

export default EditInvoice;
