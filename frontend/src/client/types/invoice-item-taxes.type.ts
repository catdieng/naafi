import type { z } from "zod"
import type { InvoiceItemTaxSchema } from "../schemas/invoice-item-taxes.schema"

export type InvoiceItemTax = z.infer<typeof InvoiceItemTaxSchema>
