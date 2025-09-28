import type { z } from "zod"

import type { TaxCreateSchema, TaxSchema, TaxUpdateSchema } from "../schemas"
import type { Message } from "./commons.type"

export type TaxPublic = z.infer<typeof TaxSchema>
export type TaxCreate = z.infer<typeof TaxCreateSchema>
export type TaxUpdate = z.infer<typeof TaxUpdateSchema>

export type TaxesPublic = {
  results: Array<TaxPublic>
  count: number
  next: string | number | null
  previous: string | number | null
}

export type TaxesReadTaxesData = {
  page?: number
  size?: number
  search?: string
  ordering?: string
}

export type TaxesReadTaxesResponse = TaxesPublic

export type TaxesCreateTaxData = {
  requestBody: TaxCreate
}

export type TaxesCreateTaxResponse = TaxPublic

export type TaxesReadTaxData = {
  id: string
}

export type TaxesReadTaxResponse = TaxPublic

export type TaxesUpdateTaxData = {
  id: number
  requestBody: TaxUpdate
}

export type TaxesUpdateTaxResponse = TaxPublic

export type TaxesDeleteTaxData = {
  id: number
}

export type TaxesDeleteTaxResponse = Message
