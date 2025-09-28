import { z } from "zod"

export const InvoiceItemTaxSchema = z.object({
  id: z.number().int().optional(),
  invoice_item_id: z.number().int(),
  tax_id: z.number().int(),
  amount: z.string(),
})
