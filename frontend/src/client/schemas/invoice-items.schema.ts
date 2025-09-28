import { z } from "zod";
import { InvoiceItemTaxSchema } from "./invoice-item-taxes.schema";

export const InvoiceItemSchema = z.object({
	id: z.number().int().positive().optional(),
	invoice_id: z.number().int().optional(),
	service_id: z.number().int(),
	quantity: z.string(),
	unit_price: z.string(),
	taxes: z.array(InvoiceItemTaxSchema).optional(),
});
