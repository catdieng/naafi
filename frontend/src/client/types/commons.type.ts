export type Message = {
  message: string
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type UtilsTestEmailData = {
  emailTo: string
}

export type UtilsTestEmailResponse = Message

export type UtilsHealthCheckResponse = boolean
