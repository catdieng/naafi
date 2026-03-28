import { z } from "zod";
import { InvoiceItemTaxSchema } from "./invoice-item-taxes.schema";

export const InvoiceItemSchema = z.object({
	id: z.number().int().positive().optional(),
	invoice_id: z.number().int().optional(),
	service_id: z
		.string()
		.trim()
		.min(1, "Please select a service for each line item"),
	quantity: z.string(),
	unit_price: z.string(),
	taxes: z.array(InvoiceItemTaxSchema).optional(),
});
