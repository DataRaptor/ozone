import { User } from "@prisma/client"

interface IBaseAuthPayload {
  email?: string
  password?: string
  address?: string
  signature?: string
  messageId?: string
  mode: string
}

export interface ISignupUserPayload extends IBaseAuthPayload {
  name?: string
}

export interface ISigninUserPayload extends IBaseAuthPayload {}

export interface IUser extends User {}
