export interface IAddClientPayload {
  email: string
  name?: string
  companyName?: string
  firstName?: string
  lastName?: string
  taxNumber?: string
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface IUpdateClientPayload extends IGetClientPayload {
  client: IAddClientPayload
}

export interface IGetClientPayload {
  id: string
}

export interface IDeleteClientPayload extends IGetClientPayload {}
