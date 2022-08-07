export interface IAddCompanyPayload {
  name?: string
  email?: string
  phone?: string
  taxNumber?: string
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface IGetCompanyPayload {
  id: string
}

export interface IUpdateCompanyPayload extends IGetCompanyPayload {
  company: IAddCompanyPayload
}
