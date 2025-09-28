import type { z } from "zod"
import type {
  InvoiceCreateSchema,
  InvoiceSchema,
  InvoiceUpdateSchema,
} from "../schemas"
import type { Message } from "./commons.type"

export type InvoicePublic = z.infer<typeof InvoiceSchema>
export type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>
export type InvoiceUpdate = z.infer<typeof InvoiceUpdateSchema>

export type InvoicesPublic = {
  results: Array<InvoicePublic>
  count: number
  next: string | number | null
  previous: string | number | null
}

export type InvoicesReadInvoicesData = {
  page?: number
  size?: number
  search?: string
  ordering?: string
}

export type InvoicesReadInvoicesResponse = InvoicesPublic

export type InvoicesCreateInvoiceData = {
  requestBody: InvoiceCreate
}

export type InvoicesCreateInvoiceResponse = InvoicePublic

export type InvoicesReadInvoiceData = {
  id: string
}

export type InvoicesReadInvoiceResponse = InvoicePublic

export type InvoicesUpdateInvoiceData = {
  id: number
  requestBody: InvoiceUpdate
}

export type InvoicesUpdateInvoiceResponse = InvoicePublic

export type InvoicesDeleteInvoiceData = {
  id: number
}

export type InvoicesDeleteInvoiceResponse = Message
