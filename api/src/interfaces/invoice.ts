export interface IBaseInvoicePayload {
  title: string
  notes?: string
  number: string
  dueAt: number
  issuedAt: number
  clientId: string
  status: InvoiceStatus
  paymentTokenId: string
  paymentAddressId: string
  items: ICreateInvoiceItemPayload[]
}

export interface ICreateInvoiceItemPayload {
  id?: string
  description: string
  quantity: number
  price: number
  discount?: number
  tax?: number
  companyId: string
  mode: string
}

export interface ICreateInvoicePayload extends IBaseInvoicePayload {}

export interface IUpdateInvoicePayload extends IGetInvoicePayload {
  invoice: IBaseInvoicePayload
}

export interface IGetInvoicePayload {
  id: string
}

export interface IGetInvoicesPayload {
  status?: InvoiceStatus
}

export type InvoiceStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "PAID"
