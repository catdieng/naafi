import { z } from "zod"

export const OrganizationCreateSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  description: z.string().optional(),
  industry: z.string().min(2, "Industry is required"),
  zip_code: z.string().min(3).max(10, "Invalid ZIP code"),
  phone_number: z.string().min(6, "Phone number is required"),
  full_name: z.string().min(2, "Contact full name is required"),
  email: z.string().email("Invalid email address"),
  logo: z.string().url("Logo must be a valid URL").optional(),
  country: z.string().min(2, "Country is required"),
  address: z.string().min(5, "Address is required"),
})

export const OrganizationUpdateSchema = OrganizationCreateSchema.partial()
