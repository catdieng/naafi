import type { UserPublic } from "."

export type PrivateUserCreate = {
  email: string
  password: string
  full_name: string
  is_verified?: boolean
}

export type PrivateCreateUserData = {
  requestBody: PrivateUserCreate
}

export type PrivateCreateUserResponse = UserPublic
