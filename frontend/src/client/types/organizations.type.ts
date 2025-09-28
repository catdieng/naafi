import type { z } from "zod"

import type {
  OrganizationCreateSchema,
  OrganizationUpdateSchema,
} from "../schemas"

export type OrganizationCreate = z.infer<typeof OrganizationCreateSchema>

export type OrganizationUpdate = z.infer<typeof OrganizationUpdateSchema>

export type OrganizationPublic = {
  id: string
  name: string
  description: string
  industry: string
  zip_code: string
  phone_number: string
  full_name: string
  email: string
  logo?: string
  country: string
  address: string
  is_active: boolean
  is_verified: boolean
}

export type OrganizationCreateData = {
  requestBody: OrganizationCreate
}

export type OrganizationCreateResponse = {
  data: OrganizationPublic
}
