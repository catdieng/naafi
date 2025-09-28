import type { Message, UserPublic, ValidationError } from "."

export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type NewPassword = {
  token: string
  new_password: string
}

export type Token = {
  token: string
  token_type?: string
}

export type AuthLoginData = Body_login_login_access_token

export type AuthLoginResponse = Token

export type AuthTestTokenResponse = UserPublic

export type AuthRecoverPasswordData = {
  email: string
}

export type AuthRecoverPasswordResponse = Message

export type AuthResetPasswordData = {
  requestBody: NewPassword
}

export type AuthResetPasswordResponse = Message

export type AuthRecoverPasswordHtmlContentData = {
  email: string
}

export type AuthRecoverPasswordHtmlContentResponse = string
