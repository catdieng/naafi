import type { z } from "zod"

import type { ItemCreateSchema, ItemSchema, ItemUpdateSchema } from "../schemas"
import type { Message } from "./commons.type"

export type ItemPublic = z.infer<typeof ItemSchema>
export type ItemCreate = z.infer<typeof ItemCreateSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>

export type ItemsPublic = {
  results: Array<ItemPublic>
  count: number
  next: string | number | null
  previous: string | number | null
}

export type ItemsReadItemsData = {
  ordering?: string
  page?: number
  size?: number
  search?: string
}

export type ItemsReadItemsResponse = ItemsPublic

export type ItemsCreateItemData = {
  requestBody: ItemCreate
}

export type ItemsCreateItemResponse = ItemPublic

export type ItemsReadItemData = {
  id: number
}

export type ItemsReadItemResponse = ItemPublic

export type ItemsUpdateItemData = {
  id: number
  requestBody: ItemUpdate
}

export type ItemsUpdateItemResponse = ItemPublic

export type ItemsDeleteItemData = {
  id: number
}

export type ItemsDeleteItemResponse = Message

export type ItemSearch = {
  search: string
}

export type ItemsSearchItemData = ItemSearch

export type ItemsSearchItemResponse = {
  results: Array<ItemPublic>
}