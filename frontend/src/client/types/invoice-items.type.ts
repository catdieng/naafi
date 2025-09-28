import type { z } from "zod"
import type { InvoiceItemSchema } from "../schemas/invoice-items.schema"

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>
